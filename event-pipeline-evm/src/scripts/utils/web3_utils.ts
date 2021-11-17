import { chunk, logger } from '../../utils';
import { Connection, InsertResult } from 'typeorm';
import { Block, ERC20BridgeTransferEvent, Transaction, TransactionLogs, TransactionReceipt } from '../../entities';
import {
    parseBlock,
    parseTransaction,
    parseTransactionLogs,
    parseTransactionReceipt,
} from '../../parsers/web3/parse_web3_objects';
import { parseBridgeFill } from '../../parsers/events/bridge_transfer_events';
import { Web3Source } from '../../data_sources/events/web3';
import { RawLogEntry } from 'ethereum-types';

import {
    BRIDGEFILL_EVENT_TOPIC,
    FIRST_SEARCH_BLOCK,
    MAX_BLOCKS_TO_PULL,
    SCHEMA,
    START_BLOCK_OFFSET,
} from '../../config';

import { Gauge } from 'prom-client';
import { SCAN_END_BLOCK, SCAN_RESULTS, SCAN_START_BLOCK } from '../../utils/metrics';

export const MISSING_TRANSACTIONS = new Gauge({
    name: 'event_scraper_missing_transactions',
    help: 'The count of how many partial transactions are in the DB, but have been reorged out of the blockchain',
    labelNames: ['includeBridgeTrades'],
});
export class PullAndSaveWeb3 {
    private readonly _web3source: Web3Source;
    constructor(web3Source: Web3Source) {
        this._web3source = web3Source;
    }

    public async getParseSaveBlocks(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const tableName = 'blocks';
        const startBlock = await this._getStartBlockAsync(connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_PULL - 1));

        SCAN_START_BLOCK.labels({ type: 'blocks' }).set(startBlock);
        SCAN_END_BLOCK.labels({ type: 'blocks' }).set(endBlock);

        logger.info(`Grabbing blocks between ${startBlock} and ${endBlock}`);
        const rawBlocks = await this._web3source.getBatchBlockInfoForRangeAsync(startBlock, endBlock);
        logger.debug('rawBlocks:');
        rawBlocks.map((rawBlock) => logger.debug(rawBlock));
        const parsedBlocks = rawBlocks.map((rawBlock) => parseBlock(rawBlock));

        SCAN_RESULTS.labels({ type: 'blocks' }).set(parsedBlocks.length);
        logger.info(`saving ${parsedBlocks.length} blocks`);

        await this._deleteOverlapAndSaveBlocksAsync(connection, parsedBlocks, startBlock, endBlock, tableName);
    }

    public async getParseSaveTx(
        connection: Connection,
        latestBlockWithOffset: number,
        shouldLookForBridgeTrades: boolean,
    ): Promise<void> {
        logger.info(`Grabbing transaction data`);
        const hashes = await this._getTxListToPullAsync(
            connection,
            latestBlockWithOffset,
            'transactions',
            shouldLookForBridgeTrades,
        );
        const rawTx = await this._web3source.getBatchTxInfoAsync(hashes);
        const foundTxs = rawTx.filter((rawTxn) => rawTxn);
        const parsedTx = foundTxs.map((rawTxn) => parseTransaction(rawTxn));

        const foundHashes = foundTxs.map((rawTxn) => rawTxn.hash);
        const missingHashes = hashes.filter((hash) => !foundHashes.includes(hash));

        MISSING_TRANSACTIONS.labels({ includeBridgeTrades: shouldLookForBridgeTrades.toString() }).set(
            missingHashes.length,
        );
        if (missingHashes.length > 0) {
            logger.child({ missingHashesTxCount: missingHashes.length }).error(`Missing hashes: ${missingHashes}`);
        }

        SCAN_RESULTS.labels({ type: 'transactions', includeBridgeTrades: shouldLookForBridgeTrades.toString() }).set(
            parsedTx.length,
        );
        logger.info(`saving ${parsedTx.length} tx`);

        if (parsedTx.length > 0) {
            const blockNumbers = parsedTx.map((tx) => tx.blockNumber);
            const minBlock = Math.min(...blockNumbers);
            const maxBlock = Math.max(...blockNumbers);
            SCAN_START_BLOCK.labels({
                type: 'transactions',
                includeBridgeTrades: shouldLookForBridgeTrades.toString(),
            }).set(minBlock);
            SCAN_END_BLOCK.labels({
                type: 'transactions',
                includeBridgeTrades: shouldLookForBridgeTrades.toString(),
            }).set(maxBlock);

            await this._saveTransactionInfo(connection, parsedTx);
        }
    }

    public async getParseSaveTxReceiptsAsync(
        connection: Connection,
        latestBlockWithOffset: number,
        shouldLookForBridgeTrades: boolean,
    ): Promise<void> {
        logger.info(`Grabbing transaction receipt data`);
        const hashes = await this._getTxListToPullAsync(
            connection,
            latestBlockWithOffset,
            'transaction_receipts',
            shouldLookForBridgeTrades,
        );

        logger.debug('Hashes to scan:');
        logger.debug(hashes);
        const rawTxReceipts = await this._web3source.getBatchTxReceiptInfoAsync(hashes);
        const foundTxReceipts = rawTxReceipts.filter((rawTxReceipt) => rawTxReceipt);

        const parsedReceipts = foundTxReceipts.map((rawTxReceipt) => parseTransactionReceipt(rawTxReceipt));
        const parsedTxLogs = foundTxReceipts.map((rawTxReceipt) => parseTransactionLogs(rawTxReceipt));

        const foundHashes = foundTxReceipts.map((rawTxReceipt) => rawTxReceipt.transactionHash);
        const missingHashes = hashes.filter((hash) => !foundHashes.includes(hash));

        if (missingHashes.length > 0) {
            logger.child({ missingHashesReceiptCount: missingHashes.length }).error(`Missing hashes: ${missingHashes}`);
        }

        let parsedBridgeTrades: ERC20BridgeTransferEvent[];

        if (shouldLookForBridgeTrades) {
            const parsedBridgeTradesNested = foundTxReceipts.map((rawTxReceipt) =>
                rawTxReceipt.logs.map((l: RawLogEntry) => {
                    if (l.topics[0] === BRIDGEFILL_EVENT_TOPIC[0]) {
                        return parseBridgeFill(l);
                    } else {
                        return new ERC20BridgeTransferEvent();
                    }
                }),
            );

            let parsedBridgeTradesWithEmptyRecords;
            if (parsedBridgeTradesNested.length > 0) {
                parsedBridgeTradesWithEmptyRecords = parsedBridgeTradesNested.reduce((acc, val) => acc.concat(val));
                parsedBridgeTrades = parsedBridgeTradesWithEmptyRecords.filter(
                    (x: ERC20BridgeTransferEvent) => x.observedTimestamp,
                );
            } else {
                parsedBridgeTrades = [];
            }
        } else {
            parsedBridgeTrades = [];
        }

        SCAN_RESULTS.labels({ type: 'receipts', includeBridgeTrades: shouldLookForBridgeTrades.toString() }).set(
            parsedReceipts.length,
        );
        logger.info(`saving ${parsedReceipts.length} tx receipts`);
        SCAN_RESULTS.labels({ type: 'bridge-trades', includeBridgeTrades: shouldLookForBridgeTrades.toString() }).set(
            parsedBridgeTrades.length,
        );
        logger.info(`saving ${parsedBridgeTrades.length} bridge trades`);
        SCAN_RESULTS.labels({ type: 'tx-logs', includeBridgeTrades: shouldLookForBridgeTrades.toString() }).set(
            parsedTxLogs.length,
        );
        logger.info(`saving ${parsedTxLogs.length} tx logs`);

        if (parsedReceipts.length > 0) {
            const blockNumbers = parsedReceipts.map((tx) => tx.blockNumber);
            const minBlock = Math.min(...blockNumbers);
            const maxBlock = Math.max(...blockNumbers);
            SCAN_START_BLOCK.labels({
                type: 'transactions',
                includeBridgeTrades: shouldLookForBridgeTrades.toString(),
            }).set(minBlock);
            SCAN_END_BLOCK.labels({
                type: 'transactions',
                includeBridgeTrades: shouldLookForBridgeTrades.toString(),
            }).set(maxBlock);

            await this._saveTransactionReceiptInfo(connection, parsedReceipts, parsedTxLogs, parsedBridgeTrades);
        }
    }

    private async _getStartBlockAsync(connection: Connection, latestBlockWithOffset: number): Promise<number> {
        const queryResult = await connection.query(
            `SELECT block_number FROM ${SCHEMA}.blocks ORDER BY block_number DESC LIMIT 1`,
        );

        const lastKnownBlock = queryResult[0] || { block_number: FIRST_SEARCH_BLOCK };

        return Math.min(Number(lastKnownBlock.block_number) + 1, latestBlockWithOffset - START_BLOCK_OFFSET);
    }

    private async _getTxListToPullAsync(
        connection: Connection,
        beforeBlock: number,
        txTable: string,
        shouldLookForBridgeTrades: boolean,
    ): Promise<string[]> {
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
                        FROM ${SCHEMA}.native_fills fe
                        LEFT JOIN ${SCHEMA}.${txTable} tx ON tx.transaction_hash = fe.transaction_hash
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
                        LIMIT 2000)

                        UNION

                        (SELECT DISTINCT
                            terc20.transaction_hash
                            , terc20.block_number
                        FROM ${SCHEMA}.transformed_erc20_events terc20
                        LEFT JOIN ${SCHEMA}.${txTable} tx ON tx.transaction_hash = terc20.transaction_hash
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
                        LIMIT 2000)
                    ORDER BY 2
                    LIMIT 2000
                ) a
            ) b;
            `);
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
                        FROM ${SCHEMA}.erc20_bridge_transfer_events bte
                        LEFT JOIN ${SCHEMA}.${txTable} tx ON tx.transaction_hash = bte.transaction_hash
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
                        LIMIT 2000)
                ) a
            ) b;
            `);
        }

        const txList = queryResult.map((e: { transaction_hash: string }) => e.transaction_hash);

        return txList;
    }

    private async _deleteOverlapAndSaveBlocksAsync(
        connection: Connection,
        toSave: Block[],
        startBlock: number,
        endBlock: number,
        tableName: string,
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            // delete events scraped prior to the most recent block range
            await queryRunner.manager.query(
                `DELETE FROM ${SCHEMA}.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock}`,
            );
            for (const chunkItems of chunk(toSave, 300)) {
                await queryRunner.manager.insert(Block, chunkItems);
            }

            // commit transaction now:
            await queryRunner.commitTransaction();
        } catch (err) {
            logger.error(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    private async _saveTransactionInfo(connection: Connection, transactions: Transaction[]): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        const txHashes = transactions.map((e) => e.transactionHash);
        const txHashList = txHashes.map((e) => `'${e}'`).toString();

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.query(
                `DELETE FROM ${SCHEMA}.transactions WHERE transaction_hash IN (${txHashList})`,
            );

            for (const chunkItems of chunk(transactions, 300)) {
                await queryRunner.manager.insert(Transaction, chunkItems);
            }

            // commit transaction now:
            await queryRunner.commitTransaction();
        } catch (err) {
            logger.error(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    private async _saveTransactionReceiptInfo(
        connection: Connection,
        txReceipts: TransactionReceipt[],
        txLogs: TransactionLogs[],
        bridgeTrades: ERC20BridgeTransferEvent[],
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        const txReceiptsHashes = txReceipts.map((e) => e.transactionHash);
        const txReceiptsHashList = txReceiptsHashes.map((e) => `'${e}'`).toString();

        const txLogsHashes = txLogs.map((e) => e.transactionHash);
        const txLogsHashList = txLogsHashes.map((e) => `'${e}'`).toString();

        const bridgeTradesHashes = bridgeTrades.map((e) => e.transactionHash);
        const bridgeTradesHashList = bridgeTradesHashes.map((e) => `'${e}'`).toString();

        logger.debug('Receipts:');
        logger.debug(txReceiptsHashes);
        logger.debug('Logs:');
        logger.debug(txLogsHashes);
        logger.debug('Bridge:');
        logger.debug(bridgeTradesHashes);

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            let query = '';
            if (txReceiptsHashList.length > 0) {
                query =
                    query +
                    `DELETE FROM ${SCHEMA}.transaction_receipts WHERE transaction_hash IN (${txReceiptsHashList});`;
            }
            if (txLogsHashList.length > 0) {
                query = query + `DELETE FROM ${SCHEMA}.transaction_logs WHERE transaction_hash IN (${txLogsHashList});`;
            }
            if (bridgeTradesHashList.length > 0) {
                query =
                    query +
                    `                DELETE FROM ${SCHEMA}.erc20_bridge_transfer_events WHERE transaction_hash IN (${bridgeTradesHashList}) AND (direct_flag IS NULL OR direct_flag = FALSE); `;
            }
            await queryRunner.manager.query(query);
            logger.debug('DELETES probably went well');

            const promises: Promise<InsertResult>[] = [];

            if (txReceiptsHashList.length > 0) {
                for (const chunkItems of chunk(txReceipts, 300)) {
                    promises.push(queryRunner.manager.insert(TransactionReceipt, chunkItems));
                }
            }
            if (txLogsHashList.length > 0) {
                for (const chunkItems of chunk(txLogs, 300)) {
                    promises.push(queryRunner.manager.insert(TransactionLogs, chunkItems));
                }
            }
            if (bridgeTradesHashList.length > 0) {
                for (const chunkItems of chunk(bridgeTrades, 300)) {
                    promises.push(queryRunner.manager.insert(ERC20BridgeTransferEvent, chunkItems));
                }
            }

            await Promise.all([promises]);
            // commit transaction now:
            await queryRunner.commitTransaction();
        } catch (err) {
            logger.error(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
