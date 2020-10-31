import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';
import {
    ERC20BridgeTransferEvent,
    LastBlockProcessed,
} from '../../entities';

import { parseUniswapSushiswapEvents } from '../../parsers/events/uniswap_events';
import { UniswapV2Source } from '../../data_sources/events/uniswap_events';

import { START_DIRECT_UNISWAP_SEARCH } from '../../constants';

import { START_BLOCK_TIMESTAMP_OFFSET, MAX_TIME_TO_SEARCH } from '../../config';

export class PullAndSaveTheGraphEvents {

    public async getParseSaveUniswapSwapsAsync(
        connection: Connection,
        uniswapV2Source: UniswapV2Source,
        latestBlockTimestampWithOffset: number,
        endpoint: string,
        protocol: string
    ): Promise<void> {
        const startTime = await this._getStartTimestampAsync(connection, latestBlockTimestampWithOffset, protocol);
        const endTime = Math.min(latestBlockTimestampWithOffset, startTime + (MAX_TIME_TO_SEARCH));
        logUtils.log(`Grabbing swap events between ${startTime} and ${endTime}`);
        const rawSwaps = await uniswapV2Source.getSwapEventsAsync(startTime, endTime, endpoint, 100);
        const parsedSwaps = rawSwaps.map(rawSwap => parseUniswapSushiswapEvents(rawSwap, protocol));

        // default to arbitrarily large number to avoid deletion
        const firstBlockNumber = parsedSwaps.reduce((acc, val) => {
            acc = ( acc === undefined || val.blockNumber < acc ) ? val.blockNumber : acc;
            return acc;
        }, 99999999999999);
        
        logUtils.log(`saving ${parsedSwaps.length} external swap events`);

        const lastBlockProcessed = await this._lastBlockProcessedAsync(protocol, endTime)

        await this._deleteOverlapAndSaveSwapEventsAsync(connection, parsedSwaps, firstBlockNumber, protocol, lastBlockProcessed);
    }

    private async _lastBlockProcessedAsync(eventName: string, endTimestamp: number): Promise<LastBlockProcessed> {
        const lastBlockProcessed = new LastBlockProcessed();
        lastBlockProcessed.eventName = eventName;
        lastBlockProcessed.lastProcessedBlockTimestamp = endTimestamp;
        lastBlockProcessed.processedTimestamp = new Date().getTime();
        return lastBlockProcessed;
    }

    private async _getStartTimestampAsync(
        connection: Connection,
        latestBlockTimestampWithOffset: number,
        eventName: string,
    ): Promise<number> {
        const queryResult = await connection.query(
            `SELECT last_processed_block_timestamp FROM events.last_block_processed WHERE event_name = '${eventName}'`,
        );
    
        logUtils.log(queryResult);
        const lastKnownBlock = queryResult[0] || {last_processed_block_timestamp: START_DIRECT_UNISWAP_SEARCH };

        return Math.min(Number(lastKnownBlock.last_processed_block_timestamp) + 1, latestBlockTimestampWithOffset - START_BLOCK_TIMESTAMP_OFFSET);
    }


    private async _deleteOverlapAndSaveSwapEventsAsync(
        connection: Connection,
        toSave: ERC20BridgeTransferEvent[],
        startBlock: number,
        protocol: string,
        lastBlockProcessed: LastBlockProcessed,
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();
    
        await queryRunner.connect();
    
        await queryRunner.startTransaction();
        try {
            
            // delete events scraped prior to the most recent block range

            await queryRunner.manager.query(`DELETE FROM events.erc20_bridge_transfer_events WHERE block_number >= ${startBlock} AND direct_protocol = '${protocol}'`);
            await queryRunner.manager.save(toSave);
            await queryRunner.manager.save(lastBlockProcessed);
            
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
