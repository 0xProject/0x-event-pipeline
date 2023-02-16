import { web3Factory } from '@0x/dev-utils';
import { Transaction, TransactionLogs, TransactionReceipt } from '../entities';
import { chunk, logger } from '../utils';
import { Connection } from 'typeorm';

import { getParseTxsAsync } from './utils/web3_utils';
import { Web3Source } from '../data_sources/events/web3';
import { ETHEREUM_RPC_URL, MAX_TX_TO_PULL, SCHEMA } from '../config';

import { SCAN_RESULTS, SCRIPT_RUN_DURATION } from '../utils/metrics';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});

const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);

// We changed the way tx data is scraped, previously it was paralell to events, now it is secuential.
// This Scraper should be used to get the missing Tx data during the transition. It expects the table backfil_tx to be filled with:
export class BackfillTxScraper {
    public async getParseSaveTxBackfillAsync(connection: Connection): Promise<void> {
        const startTime = new Date().getTime();
        logger.info(`pulling tx backlog`);

        const queryResult = await connection.query(
            `SELECT transaction_hash FROM ${SCHEMA}.tx_backfill LIMIT ${MAX_TX_TO_PULL}`,
        );

        const txList = queryResult.map((e: { transaction_hash: string }) => e.transaction_hash);

        if (txList.length > 0) {
            SCAN_RESULTS.labels({ type: 'tx-backfill' }).set(txList.length);
            const txData = await getParseTxsAsync(connection, web3Source, txList);

            const txHashList = txData.parsedTxs.map((tx) => `'${tx.transactionHash}'`).toString();
            const txDeleteQuery = `DELETE FROM ${SCHEMA}.transactions WHERE transaction_hash IN (${txHashList})`;
            const txReceiptDeleteQuery = `DELETE FROM ${SCHEMA}.transaction_receipts WHERE transaction_hash IN (${txHashList});`;
            const txLogsDeleteQuery = `DELETE FROM ${SCHEMA}.transaction_logs WHERE transaction_hash IN (${txHashList});`;
            const txBacklogQuery = `DELETE FROM ${SCHEMA}.tx_backfill WHERE transaction_hash IN (${txHashList});`;

            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();

            await queryRunner.startTransaction();
            try {
                // delete existing tx data, for safety
                await queryRunner.manager.query(txDeleteQuery);
                await queryRunner.manager.query(txReceiptDeleteQuery);
                await queryRunner.manager.query(txLogsDeleteQuery);
                await queryRunner.manager.query(txBacklogQuery);

                for (const chunkItems of chunk(txData.parsedTxs, 300)) {
                    await queryRunner.manager.insert(Transaction, chunkItems);
                }
                for (const chunkItems of chunk(txData.parsedReceipts, 300)) {
                    await queryRunner.manager.insert(TransactionReceipt, chunkItems);
                }
                for (const chunkItems of chunk(txData.parsedTxLogs, 300)) {
                    await queryRunner.manager.insert(TransactionLogs, chunkItems);
                }

                // commit transaction now:
                await queryRunner.commitTransaction();
            } catch (err) {
                logger.error(`Failed while saving tx backfill`);
                if (err instanceof Error) {
                    logger.error(err);
                } else {
                    logger.error('Unexpected Error');
                }
                // since we have errors lets rollback changes we made
                await queryRunner.rollbackTransaction();
            } finally {
                // you need to release query runner which is manually created:
                await queryRunner.release();
            }
        } else {
            SCAN_RESULTS.labels({ type: 'tx-backfill' }).set(0);
            logger.info('No tx in backlog');
        }

        const endTime = new Date().getTime();
        const scriptDurationSeconds = (endTime - startTime) / 1000;
        SCRIPT_RUN_DURATION.set({ script: 'tx-backfill' }, scriptDurationSeconds);

        logger.info(`Finished pulling tx backlog in ${scriptDurationSeconds}`);
    }
}
