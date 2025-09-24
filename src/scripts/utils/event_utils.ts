import { CHAIN_ID, FIRST_SEARCH_BLOCK, MAX_BLOCKS_REORG, MAX_BLOCKS_TO_SEARCH, SCHEMA } from '../../config';
import { Web3Source } from '../../data_sources/events/web3';
import { LastBlockProcessed } from '../../entities';
import { logger } from '../../utils/logger';
import { SCAN_END_BLOCK, SCAN_RESULTS, SCAN_START_BLOCK } from '../../utils/metrics';
import { getStartBlockAsync, getLastBlockProcessedEntity } from '../utils/event_abi_utils';
import { LogWithDecodedArgs, DecodedLogArgs } from '@0x/dev-utils';
import { BlockWithoutTransactionData } from 'ethereum-types';
import { Connection } from 'typeorm';

export class PullAndSaveEvents {
    public async getParseSaveContractWrapperEventsAsync<ARGS extends DecodedLogArgs, EVENT>(
        connection: Connection,
        web3Source: Web3Source,
        currentBlock: BlockWithoutTransactionData,
        eventName: string,
        tableName: string,
        getterFunction: (startBlockNumber: number, endBlock: number) => Promise<LogWithDecodedArgs<ARGS>[] | null>,
        parser: (decodedLog: LogWithDecodedArgs<ARGS>) => EVENT,
    ): Promise<void> {
        let startBlockResponse;
        try {
            startBlockResponse = await getStartBlockAsync(
                eventName,
                connection,
                web3Source,
                currentBlock,
                FIRST_SEARCH_BLOCK,
            );
        } catch (err) {
            logger.error(`${err}, trying next time`);
            return;
        }
        const { startBlockNumber, hasLatestBlockChanged } = startBlockResponse;

        if (!hasLatestBlockChanged) {
            logger.debug(`No new blocks to scan for ${eventName}, skipping`);
            return;
        }

        const endBlock = Math.min(
            currentBlock.number! - MAX_BLOCKS_REORG,
            startBlockNumber + (MAX_BLOCKS_TO_SEARCH - 1),
        );

        logger.info(`Searching for ${eventName} between blocks ${startBlockNumber} and ${endBlock}`);

        let endBlockHash = null;
        try {
            endBlockHash = (await web3Source.getBlockInfoAsync(endBlock)).hash;
        } catch (err) {
            logger.error(`${err}, trying next time`);
            return;
        }
        if (endBlockHash === null) {
            logger.error(`Unstable last block for ${eventName}, trying next time`);
            return;
        }

        const eventLogs = await getterFunction(startBlockNumber, endBlock);

        SCAN_START_BLOCK.labels({ type: 'event', event: eventName }).set(startBlockNumber);
        SCAN_END_BLOCK.labels({ type: 'event', event: eventName }).set(endBlock);

        if (eventLogs === null) {
            logger.info(`Encountered an error searching for ${eventName} ${SCHEMA}. Waiting until next iteration.`);
        } else {
            const parsedEventLogs = eventLogs.map((log) => parser(log));
            const lastBlockProcessed: LastBlockProcessed = getLastBlockProcessedEntity(
                eventName,
                endBlock,
                endBlockHash,
            );

            SCAN_RESULTS.labels({ type: 'event', event: eventName }).set(parsedEventLogs.length);
            logger.info(`saving ${parsedEventLogs.length} ${eventName} events`);

            await this._deleteOverlapAndSaveAsync<EVENT>(
                connection,
                parsedEventLogs,
                startBlockNumber,
                endBlock,
                tableName,
                lastBlockProcessed,
            );
        }
    }

    private async _deleteOverlapAndSaveAsync<T>(
        connection: Connection,
        toSave: T[],
        startBlockNumber: number,
        endBlock: number,
        tableName: string,
        lastBlockProcessed: LastBlockProcessed,
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            // delete events scraped prior to the most recent block range
            await queryRunner.manager.query(
                `DELETE FROM ${SCHEMA}.${tableName}_${CHAIN_ID} WHERE block_number >= ${startBlockNumber} AND block_number <= ${endBlock}`,
            );
            await queryRunner.manager.save(toSave);
            await queryRunner.manager.save(lastBlockProcessed);

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
