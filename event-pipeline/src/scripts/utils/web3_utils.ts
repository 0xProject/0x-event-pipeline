import { logger } from '@0x/pipeline-utils';
import { Connection } from 'typeorm';
import { Block, ERC20BridgeTransferEvent, Transaction, TransactionLogs, TransactionReceipt } from '../../entities';
import {
    parseBlock,
    parseTransaction,
    parseTransactionReceipt,
    parseTransactionLogs,
} from '../../parsers/web3/parse_web3_objects';
import {
    parseErc20BridgeTransfer,
    parseBridgeFill,
    parseNewBridgeFill,
} from '../../parsers/events/bridge_transfer_events';
import { Web3Source } from '@0x/pipeline-utils';
import { RawLogEntry } from 'ethereum-types';

import {
    FIRST_SEARCH_BLOCK,
    MAX_BLOCKS_TO_PULL,
    START_BLOCK_OFFSET,
    BRIDGE_TRADE_TOPIC,
    BRIDGEFILL_EVENT_TOPIC,
    BLOCKS_REORG_CHECK_RECEIPTS,
} from '../../config';

import { NEWBRIDGEFILL_EVENT_TOPIC } from '../../constants';

export class PullAndSaveWeb3 {
    private readonly _web3source: Web3Source;
    constructor(web3Source: Web3Source) {
        this._web3source = web3Source;
    }

    public async getParseSaveBlocks(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const tableName = 'blocks';
        const startBlock = await this._getStartBlockAsync(connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_PULL - 1));
        logger
            .child({ startBlock, endBlock, lag: latestBlockWithOffset - startBlock, type: 'BLOCK_LAG' })
            .info(`Grabbing blocks`);
        const rawBlocks = await this._web3source.getBatchBlockInfoForRangeAsync(startBlock, endBlock);
        const parsedBlocks = rawBlocks.map(rawBlock => parseBlock(rawBlock));

        logger.child({ count: parsedBlocks.length }).info(`saving blocks`);

        await this._deleteOverlapAndSaveBlocksAsync<Block>(connection, parsedBlocks, startBlock, endBlock, tableName);
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
        const parsedTx = rawTx.map(rawTx => parseTransaction(rawTx));

        logger.child({ count: parsedTx.length }).info(`saving batch txs`);

        if (parsedTx.length > 0) {
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
        const rawTxReceipts = await this._web3source.getBatchTxReceiptInfoAsync(hashes);
        const parsedReceipts = rawTxReceipts.map(rawTxReceipt => parseTransactionReceipt(rawTxReceipt));
        const parsedTxLogs = rawTxReceipts.map(rawTxReceipt => parseTransactionLogs(rawTxReceipt));

        let parsedBridgeTrades: ERC20BridgeTransferEvent[];

        if (shouldLookForBridgeTrades) {
            const parsedBridgeTradesNested = rawTxReceipts.map(rawTxReceipt =>
                rawTxReceipt.logs.map((l: RawLogEntry) => {
                    if (l.topics[0] === BRIDGE_TRADE_TOPIC[0]) {
                        return parseErc20BridgeTransfer(l);
                    } else {
                        if (l.topics[0] === BRIDGEFILL_EVENT_TOPIC[0]) {
                            return parseBridgeFill(l);
                        } else {
                            if (l.topics[0] === NEWBRIDGEFILL_EVENT_TOPIC[0]) {
                                return parseNewBridgeFill(l);
                            } else {
                                return new ERC20BridgeTransferEvent();
                            }
                        }
                    }
                }),
            );

            let parsedBridgeTradesWithEmptyRecords;
            if (parsedBridgeTradesNested.length > 0) {
                parsedBridgeTradesWithEmptyRecords = parsedBridgeTradesNested.reduce((acc, val) => acc.concat(val));
                parsedBridgeTrades = parsedBridgeTradesWithEmptyRecords.filter((x: any) => x.observedTimestamp);
            } else {
                parsedBridgeTrades = [];
            }
        } else {
            parsedBridgeTrades = [];
        }

        logger.child({ count: parsedReceipts.length }).info(`saving tx receipts`);
        logger.child({ count: parsedBridgeTrades.length }).info(`saving bridge trades`);

        if (parsedReceipts.length > 0) {
            await this._saveTransactionReceiptInfo(connection, parsedReceipts, parsedTxLogs, parsedBridgeTrades);
        }
    }

    private async _getStartBlockAsync(connection: Connection, latestBlockWithOffset: number): Promise<number> {
        const queryResult = await connection.query(
            `SELECT block_number FROM events.blocks ORDER BY block_number DESC LIMIT 1`,
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
        const afterBlock = beforeBlock - BLOCKS_REORG_CHECK_RECEIPTS;
        logger.info(
            `Looking for tx that changed blocks between blocks ${afterBlock} and ${beforeBlock}. Including bridge trades: ${shouldLookForBridgeTrades}`,
        );
        if (shouldLookForBridgeTrades) {
            queryResult = await connection.query(`
            WITH rececnt_transaction_receipts AS (
  SELECT
    transaction_hash,
    block_hash
  FROM events.${txTable}
  WHERE
    block_number BETWEEN ${afterBlock} AND ${beforeBlock}

)
SELECT DISTINCT
                    transaction_hash
                FROM (
                    SELECT DISTINCT
                        transaction_hash
                        , block_number
                    FROM (
                        (SELECT
                            fe.transaction_hash
                            , fe.block_number
                        FROM (
                          SELECT
                            transaction_hash,
                            block_number,
                            block_hash
                        FROM events.native_fills
                        WHERE
                          block_number BETWEEN ${afterBlock} AND ${beforeBlock}
                    )fe
                        LEFT JOIN rececnt_transaction_receipts tx ON tx.transaction_hash = fe.transaction_hash
                        WHERE
                            (
                                -- tx info hasn't been pulled
                                tx.transaction_hash IS NULL
                                -- or tx where the block info has changed
                                OR (
                                    tx.block_hash <> fe.block_hash
                                )
                            )
                        )

                        UNION

                        (SELECT
                            terc20.transaction_hash
                            , terc20.block_number
                        FROM (
                          SELECT
                            transaction_hash,
                            block_number,
                            block_hash
                        FROM events.transformed_erc20_events
                        WHERE
                          block_number BETWEEN ${afterBlock} AND ${beforeBlock}
                    ) terc20
                        LEFT JOIN rececnt_transaction_receipts tx ON tx.transaction_hash = terc20.transaction_hash
                        WHERE
                            (
                                -- tx info hasn't been pulled
                                tx.transaction_hash IS NULL
                                -- or tx where the block info has changed
                                OR (
                                    tx.block_hash <> terc20.block_hash
                                )
                            )
                        )

                        UNION

                        (SELECT
                            ce.transaction_hash
                            , ce.block_number
                        FROM (
                          SELECT
                            transaction_hash,
                            block_number,
                            block_hash
                        FROM events.cancel_events
                        WHERE
                          block_number BETWEEN ${afterBlock} AND ${beforeBlock}
                    ) ce
                        LEFT JOIN rececnt_transaction_receipts tx ON tx.transaction_hash = ce.transaction_hash
                        WHERE
                            (
                                -- tx info hasn't been pulled
                                tx.transaction_hash IS NULL
                                -- or tx where the block info has changed
                                OR (
                                    tx.block_hash <> ce.block_hash
                                )
                            )
                        )

                        UNION

                        (SELECT
                            ce.transaction_hash
                            , ce.block_number
                        FROM (
                          SELECT
                            transaction_hash,
                            block_number,
                            block_hash
                        FROM events.cancel_up_to_events
                        WHERE
                          block_number BETWEEN ${afterBlock} AND ${beforeBlock}
                    ) ce
                        LEFT JOIN rececnt_transaction_receipts tx ON tx.transaction_hash = ce.transaction_hash
                        WHERE
                            (
                                -- tx info hasn't been pulled
                                tx.transaction_hash IS NULL
                                -- or tx where the block info has changed
                                OR (
                                    tx.block_hash <> ce.block_hash
                                )
                            )
                        )
                    ORDER BY 2
                    LIMIT 100
                ) a
            ) b;
            `);
        } else {
            queryResult = await connection.query(`
              WITH rececnt_transaction_receipts AS (
        SELECT
                transaction_hash,
                block_hash
        FROM events.${txTable}
        WHERE
                block_number BETWEEN ${afterBlock} AND ${beforeBlock}
)

SELECT DISTINCT
    transaction_hash
FROM (
    SELECT
        bte.transaction_hash
        , bte.block_number
    FROM (
      SELECT
              transaction_hash,
              block_number,
              block_hash
          FROM events.erc20_bridge_transfer_events
          WHERE
              block_number BETWEEN ${afterBlock} AND ${beforeBlock} AND
              direct_flag
    ) bte
    LEFT JOIN rececnt_transaction_receipts tx ON tx.transaction_hash = bte.transaction_hash
    WHERE
      (
            -- tx info hasn't been pulled
            tx.transaction_hash IS NULL
            -- commenting out below, since we don't have block hashes from the graph
            -- or tx where the block info has changed
            -- OR (
            -- tx.block_hash <> bte.block_hash
            -- )
        )
) a

                                                 `);
        }

        const txList = queryResult.map((e: { transaction_hash: string }) => e.transaction_hash);

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
            await queryRunner.manager.query(
                `DELETE FROM events.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock}`,
            );
            await queryRunner.manager.save(toSave);

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

        const txHashes = transactions.map(e => e.transactionHash);
        const txHashList = txHashes.map(e => `'${e}'`).toString();

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.query(
                `DELETE FROM events.transactions WHERE transaction_hash IN (${txHashList})`,
            );

            await queryRunner.manager.save(transactions);

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

    private async _saveTransactionReceiptInfo<T>(
        connection: Connection,
        txReceipts: TransactionReceipt[],
        txLogs: TransactionLogs[],
        bridgeTrades: ERC20BridgeTransferEvent[],
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        const txHashes = txReceipts.map(e => e.transactionHash);
        const txHashList = txHashes.map(e => `'${e}'`).toString();

        const txReceiptsHashes = txReceipts.map(e => e.transactionHash);
        const txReceiptsHashList = txReceiptsHashes.map(e => `'${e}'`).toString();

        const txLogsHashes = txLogs.map(e => e.transactionHash);
        const txLogsHashList = txLogsHashes.map(e => `'${e}'`).toString();

        const bridgeTradesHashes = bridgeTrades.map(e => e.transactionHash);
        const bridgeTradesHashList = bridgeTradesHashes.map(e => `'${e}'`).toString();

        logger.info('Receipts:');
        logger.info(txReceiptsHashes);
        logger.info('Logs:');
        logger.info(txLogsHashes);
        logger.info('Bridge:');
        logger.info(bridgeTradesHashes);

        logger.info('Connecting to Query Runner');
        await queryRunner.connect();

        logger.info('Starting Transaction');

        await queryRunner.startTransaction();
        try {
            logger.info('Starting to delete old info');
            await queryRunner.manager.query(`
                DELETE FROM events.transaction_receipts WHERE transaction_hash IN (${txHashList});
                DELETE FROM events.transaction_logs WHERE transaction_hash IN (${txHashList});
                DELETE FROM events.erc20_bridge_transfer_events WHERE transaction_hash IN (${txHashList}) AND (direct_flag IS NULL OR direct_flag = FALSE);
            `);

            logger.info('Starting to save new info');

            await Promise.all([
                queryRunner.manager.save(txReceipts),
                queryRunner.manager.save(txLogs),
                queryRunner.manager.save(bridgeTrades),
            ]);

            logger.info('Everything OK, commiting transaction');
            // commit transaction now:
            await queryRunner.commitTransaction();
            logger.info('Transaction commited');
        } catch (err) {
            logger.error('There was an error deteting or saving');
            logger.error(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
