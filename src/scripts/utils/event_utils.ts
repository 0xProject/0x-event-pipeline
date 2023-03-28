import { logger } from '../../utils/logger';
import { Connection } from 'typeorm';

import { FIRST_SEARCH_BLOCK, MAX_BLOCKS_TO_SEARCH, SCHEMA, START_BLOCK_OFFSET } from '../../config';
import { LastBlockProcessed } from '../../entities';
import { LogWithDecodedArgs } from '@0x/dev-utils';
import { getStartBlockAsync, getLastBlockProcessedEntity } from '../utils/event_abi_utils';
import { Web3Source } from '../../data_sources/events/web3';

import { SCAN_END_BLOCK, SCAN_RESULTS, SCAN_START_BLOCK } from '../../utils/metrics';

export class PullAndSaveEvents {
    public async getParseSaveContractWrapperEventsAsync<ARGS, EVENT>(
        connection: Connection,
        web3Source: Web3Source,
        latestBlockWithOffset: number,
        eventName: string,
        tableName: string,
        getterFunction: (startBlock: number, endBlock: number) => Promise<LogWithDecodedArgs<ARGS>[] | null>,
        parser: (decodedLog: LogWithDecodedArgs<ARGS>) => EVENT,
    ): Promise<void> {
        const { startBlock, hasLatestBlockChanged } = await getStartBlockAsync(
            eventName,
            connection,
            web3Source,
            latestBlockWithOffset,
            FIRST_SEARCH_BLOCK,
        );

        if (!hasLatestBlockChanged) {
            logger.debug(`No new blocks to scan for ${eventName}, skipping`);
            return;
        }

        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));

        logger.info(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);

        const endBlockHash = (await web3Source.getBlockInfoAsync(endBlock)).hash;

        if (endBlockHash === null) {
            logger.error(`Unstable last block for ${eventName}, trying next time`);
            return;
        }

        const eventLogs = await getterFunction(startBlock, endBlock);

        SCAN_START_BLOCK.labels({ type: 'event', event: eventName }).set(startBlock);
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
                startBlock,
                endBlock,
                tableName,
                lastBlockProcessed,
            );
        }
    }

    private async _deleteOverlapAndSaveAsync<T>(
        connection: Connection,
        toSave: T[],
        startBlock: number,
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
                `DELETE FROM ${SCHEMA}.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock}`,
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
