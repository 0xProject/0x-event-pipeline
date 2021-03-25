import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';
import {
    Block,
    ERC20BridgeTransferEvent,
    Transaction,
    TransactionLogs,
    TransactionReceipt,
} from '../../entities';
import {
   parseBlock,
   parseTransaction,
   parseTransactionReceipt,
   parseTransactionLogs,
} from '../../parsers/web3/parse_web3_objects';
import {
    parseBridgeFill
} from '../../parsers/events/bridge_transfer_events';
import { Web3Source } from '../../data_sources/web3';
import { RawLogEntry } from 'ethereum-types';

import { FIRST_SEARCH_BLOCK, MAX_BLOCKS_TO_PULL, START_BLOCK_OFFSET, BRIDGEFILL_EVENT_TOPIC } from '../../config';


export class PullAndSaveWeb3 {
    private readonly _web3source: Web3Source;
    constructor(web3Source: Web3Source) {
        this._web3source = web3Source;
    }

    public async getParseSaveBlocks(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const tableName = 'blocks';
        const startBlock = await this._getStartBlockAsync(connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_PULL - 1));
        logUtils.log(`Grabbing blocks between ${startBlock} and ${endBlock}`);
        const rawBlocks = await this._web3source.getBatchBlockInfoForRangeAsync(startBlock, endBlock);
        const parsedBlocks = rawBlocks.map(rawBlock => parseBlock(rawBlock));

        logUtils.log(`saving ${parsedBlocks.length} blocks`);

        await this._deleteOverlapAndSaveBlocksAsync<Block>(connection, parsedBlocks, startBlock, endBlock, tableName);
    }

    public async getParseSaveTx(connection: Connection, latestBlockWithOffset: number, shouldLookForBridgeTrades: boolean): Promise<void> {
        logUtils.log(`Grabbing transaction data`);
        const hashes = await this._getTxListToPullAsync(connection, latestBlockWithOffset, 'transactions', shouldLookForBridgeTrades);
        const rawTx = await this._web3source.getBatchTxInfoAsync(hashes);
        const parsedTx = rawTx.map(rawTx => parseTransaction(rawTx));

        logUtils.log(`saving ${parsedTx.length} tx`);

        if(parsedTx.length > 0) {
            await this._saveTransactionInfo(connection, parsedTx);
        }
    }

    public async getParseSaveTxReceiptsAsync(connection: Connection, latestBlockWithOffset: number, shouldLookForBridgeTrades: boolean): Promise<void> {
        logUtils.log(`Grabbing transaction receipt data`);
        const hashes = await this._getTxListToPullAsync(connection, latestBlockWithOffset, 'transaction_receipts', shouldLookForBridgeTrades);
        const rawTxReceipts = await this._web3source.getBatchTxReceiptInfoAsync(hashes);
        const parsedReceipts = rawTxReceipts.map(rawTxReceipt => parseTransactionReceipt(rawTxReceipt));
        const parsedTxLogs = rawTxReceipts.map(rawTxReceipt => parseTransactionLogs(rawTxReceipt));

        let parsedBridgeTrades: ERC20BridgeTransferEvent[];

        if (shouldLookForBridgeTrades) {
            const parsedBridgeTradesNested = rawTxReceipts.map(rawTxReceipt =>
                rawTxReceipt.logs.map((l: RawLogEntry) => {
                    if(l.topics[0] === BRIDGEFILL_EVENT_TOPIC[0]) {
                        return parseBridgeFill(l);
                    } else {
                        return new ERC20BridgeTransferEvent();
                    }
                })
            );

            let parsedBridgeTradesWithEmptyRecords;
            if (parsedBridgeTradesNested.length > 0) {
                parsedBridgeTradesWithEmptyRecords = parsedBridgeTradesNested.reduce((acc, val) =>
                    acc.concat(val),
                );
                parsedBridgeTrades = parsedBridgeTradesWithEmptyRecords.filter(
                    (x: any) => x.observedTimestamp,
                );
            } else {
                parsedBridgeTrades = [];
            };
        } else {
            parsedBridgeTrades = [];
        }


        logUtils.log(`saving ${parsedReceipts.length} tx receipts`);
        logUtils.log(`saving ${parsedBridgeTrades.length} bridge trades`);

        if(parsedReceipts.length > 0) {
            await this._saveTransactionReceiptInfo(connection, parsedReceipts, parsedTxLogs, parsedBridgeTrades);
        }
    }

    private async _getStartBlockAsync(connection: Connection, latestBlockWithOffset: number): Promise<number> {
        const queryResult = await connection.query(
            `SELECT block_number FROM events_bsc.blocks ORDER BY block_number DESC LIMIT 1`,
        );

        const lastKnownBlock = queryResult[0] || {block_number: FIRST_SEARCH_BLOCK};

        return Math.min(Number(lastKnownBlock.block_number) + 1, latestBlockWithOffset - START_BLOCK_OFFSET);
    }

    private async _getTxListToPullAsync(connection: Connection, beforeBlock: number, txTable: string, shouldLookForBridgeTrades: boolean): Promise<string[]> {
        let queryResult: any;
        if (shouldLookForBridgeTrades) {
            queryResult = await connection.query(`
                SELECT DISTINCT
                    transaction_hash
                FROM (
                    SELECT DISTINCT
                        transaction_hash
                        , block_number
                    FROM (
                        (SELECT DISTINCT
                            fe.transaction_hash
                            , fe.block_number
                        FROM events_bsc.native_fills fe
                        LEFT JOIN events_bsc.${txTable} tx ON tx.transaction_hash = fe.transaction_hash
                        WHERE
                            fe.block_number < ${beforeBlock}
                            AND (
                                -- tx info hasn't been pulled
                                tx.transaction_hash IS NULL
                                -- or tx where the block info has changed
                                OR (
                                    tx.block_hash <> fe.block_hash
                                )
                            )
                        ORDER BY 2
                        LIMIT 100)

                        UNION

                        (SELECT DISTINCT
                            terc20.transaction_hash
                            , terc20.block_number
                        FROM events_bsc.transformed_erc20_events terc20
                        LEFT JOIN events_bsc.${txTable} tx ON tx.transaction_hash = terc20.transaction_hash
                        WHERE
                            terc20.block_number < ${beforeBlock}
                            AND (
                                -- tx info hasn't been pulled
                                tx.transaction_hash IS NULL
                                -- or tx where the block info has changed
                                OR (
                                    tx.block_hash <> terc20.block_hash
                                )
                            )
                        ORDER BY 2
                        LIMIT 100)
                    ORDER BY 2
                    LIMIT 100
                ) a
            ) b;
            `,
            );
        } else {
            queryResult = await connection.query(`
                SELECT DISTINCT
                    transaction_hash
                FROM (
                    SELECT DISTINCT
                        transaction_hash
                        , block_number
                    FROM (
                        (SELECT DISTINCT
                            bte.transaction_hash
                            , bte.block_number
                        FROM events_bsc.erc20_bridge_transfer_events bte
                        LEFT JOIN events_bsc.${txTable} tx ON tx.transaction_hash = bte.transaction_hash
                        WHERE
                            bte.block_number < ${beforeBlock}
                            AND (
                                -- tx info hasn't been pulled
                                tx.transaction_hash IS NULL
                                -- commenting out below, since we don't have block hashes from the graph
                                -- or tx where the block info has changed
                                -- OR (
                                -- tx.block_hash <> bte.block_hash
                                -- )
                            )
                            AND direct_flag
                        ORDER BY 2
                        LIMIT 100)
                ) a
            ) b;
            `,
            );
        }


        const txList = queryResult.map((e: {transaction_hash: string}) => e.transaction_hash);

        return txList;
    }

    private async _deleteOverlapAndSaveBlocksAsync<T>(
        connection: Connection,
        toSave: T[],
        startBlock: number,
        endBlock: number,
        tableName: string,
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {

            // delete events scraped prior to the most recent block range
            await queryRunner.manager.query(`DELETE FROM events_bsc.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock}`);
            await queryRunner.manager.save(toSave);

            // commit transaction now:
            await queryRunner.commitTransaction();

        } catch (err) {

            logUtils.log(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();

        } finally {

            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    private async _saveTransactionInfo(
        connection: Connection,
        transactions: Transaction[],
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        const txHashes = transactions.map(e => e.transactionHash);
        const txHashList = txHashes.map(e => `'${e}'`).toString();

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {

            await queryRunner.manager.query(`DELETE FROM events_bsc.transactions WHERE transaction_hash IN (${txHashList})`);

            await queryRunner.manager.save(transactions);

            // commit transaction now:
            await queryRunner.commitTransaction();

        } catch (err) {

            logUtils.log(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();

        } finally {

            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    private async _saveTransactionReceiptInfo<T>(
        connection: Connection,
        txReceipts: TransactionReceipt[],
        txLogs: TransactionLogs[],
        bridgeTrades: ERC20BridgeTransferEvent[],
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        const txHashes = txReceipts.map(e => e.transactionHash);
        const txHashList = txHashes.map(e => `'${e}'`).toString();

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.query(`
                DELETE FROM events_bsc.transaction_receipts WHERE transaction_hash IN (${txHashList});
                DELETE FROM events_bsc.transaction_logs WHERE transaction_hash IN (${txHashList});
                DELETE FROM events_bsc.erc20_bridge_transfer_events WHERE transaction_hash IN (${txHashList}) AND (direct_flag IS NULL OR direct_flag = FALSE);
            `);

            await Promise.all([
                queryRunner.manager.save(txReceipts),
                queryRunner.manager.save(txLogs),
                queryRunner.manager.save(bridgeTrades),
            ]);

            // commit transaction now:
            await queryRunner.commitTransaction();

        } catch (err) {

            logUtils.log(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();

        } finally {

            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
