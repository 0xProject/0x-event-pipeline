import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';

import { FIRST_SEARCH_BLOCK, MAX_BLOCKS_TO_SEARCH, START_BLOCK_OFFSET } from '../../config';
import {
    FillEvent,
    StakingPoolCreatedEvent,
    LastBlockProcessed,
    StakeEvent,
    UnstakeEvent,
    MoveStakeEvent,
    EpochEndedEvent,
    StakingPoolEarnedRewardsInEpochEvent,
    MakerStakingPoolSetEvent,
    ParamsSetEvent,
    OperatorShareDecreasedEvent,
    EpochFinalizedEvent,
    RewardsPaidEvent,
} from '../../entities';
import { parseFillEvent } from '../../parsers/events/fill_events';
import { 
    parseStakeEvent,
    parseUnstakeEvent,
    parseMoveStakeEvent,
    parseStakingPoolCreatedEvent,
    parseEpochEndedEvent,
    parseStakingPoolEarnedRewardsInEpochEvent,
    parseMakerStakingPoolSetEvent,
    parseParamsSetEvent,
    parseOperatorShareDecreasedEvent,
    parseEpochFinalizedEvent,
    parseRewardsPaidEvent,
} from '../../parsers/events/staking_events';
import { EventsSource } from '../../data_sources/events/0x_events';


export class PullAndSaveEvents {
    private readonly _eventsSource: EventsSource;

    constructor(eventsSource: EventsSource) {
        this._eventsSource = eventsSource;
    }

    public async getParseSaveFillEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'FillEvent';
        const tableName = 'fill_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs= await this._eventsSource.getFillEventsAsync(startBlock, endBlock);

        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseFillEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<FillEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    public async getParseSaveStakeEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'StakeEvent';
        const tableName = 'stake_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs= await this._eventsSource.getStakeEventsAsync(startBlock, endBlock);

        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseStakeEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<StakeEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    public async getParseSaveUnstakeEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'UnstakeEvent';
        const tableName = 'unstake_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs= await this._eventsSource.getUnstakeEventsAsync(startBlock, endBlock);
        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseUnstakeEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<UnstakeEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    public async getParseSaveMoveStakeEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'MoveStake';
        const tableName = 'move_stake_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs= await this._eventsSource.getMoveStakeEventsAsync(startBlock, endBlock);
        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseMoveStakeEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<MoveStakeEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    public async getParseSaveStakingPoolCreatedEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'StakingPoolCreated';
        const tableName = 'staking_pool_created_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs= await this._eventsSource.getStakingPoolCreatedEventsAsync(startBlock, endBlock);
        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseStakingPoolCreatedEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<StakingPoolCreatedEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    public async getParseSaveStakingPoolEarnedRewardsInEpochEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'StakingPoolEarnedRewardsInEpoch';
        const tableName = 'staking_pool_earned_rewards_in_epoch_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs= await this._eventsSource.getStakingPoolEarnedRewardsInEpochEventsAsync(startBlock, endBlock);
        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseStakingPoolEarnedRewardsInEpochEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<StakingPoolEarnedRewardsInEpochEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    public async getParseSaveMakerStakingPoolSetEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'MakerStakingPoolSet';
        const tableName = 'maker_staking_pool_set_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs = await this._eventsSource.getMakerStakingPoolSetEventsAsync(startBlock, endBlock);
        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseMakerStakingPoolSetEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<MakerStakingPoolSetEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    public async getParseSaveParamsSetEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'ParamsSet';
        const tableName = 'params_set_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs = await this._eventsSource.getParamsSetEventsAsync(startBlock, endBlock);
        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseParamsSetEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<ParamsSetEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    public async getParseSaveOperatorShareDecreasedEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'OperatorShareDecreased';
        const tableName = 'operator_share_decreased_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs= await this._eventsSource.getOperatorShareDecreasedEventsAsync(startBlock, endBlock);
        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseOperatorShareDecreasedEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<OperatorShareDecreasedEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    public async getParseSaveEpochEndedEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'EpochEnded';
        const tableName = 'epoch_ended_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs= await this._eventsSource.getEpochEndedEventsAsync(startBlock, endBlock);
        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseEpochEndedEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<EpochEndedEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    public async getParseSaveEpochFinalizedEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'EpochFinalized';
        const tableName = 'epoch_finalized_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs= await this._eventsSource.getEpochFinalizedEventsAsync(startBlock, endBlock);
        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseEpochFinalizedEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<EpochFinalizedEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    public async getParseSaveRewardsPaidEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const eventName = 'RewardsPaid';
        const tableName = 'rewards_paid_events';
        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
        const eventLogs= await this._eventsSource.getRewardsPaidEventsAsync(startBlock, endBlock);
        if (eventLogs === null) {
            logUtils.log(`Encountered an error searching for ${eventName} events. Waiting until next iteration.`)
        }
        else {
            const parsedEventLogs = eventLogs.map(log => parseRewardsPaidEvent(log));
            const lastBlockProcessed: LastBlockProcessed = await this._lastBlockProcessedAsync(eventName, endBlock);
        
            logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    
            await this._deleteOverlapAndSaveAsync<RewardsPaidEvent>(connection, parsedEventLogs, startBlock, endBlock, tableName, lastBlockProcessed);
        }
    }

    private async _lastBlockProcessedAsync(eventName: string, endBlock: number): Promise<LastBlockProcessed> {
        const lastBlockProcessed = new LastBlockProcessed();
        lastBlockProcessed.eventName = eventName;
        lastBlockProcessed.lastProcessedBlockNumber = endBlock;
        lastBlockProcessed.processedTimestamp = new Date().getTime();
        return lastBlockProcessed;
    }

    private async _getStartBlockAsync(eventName: string, connection: Connection, latestBlockWithOffset: number): Promise<number> {
        const queryResult = await connection.query(
            `SELECT last_processed_block_number FROM events.last_block_processed WHERE event_name = '${eventName}'`,
        );
    
        logUtils.log(queryResult);
        const lastKnownBlock = queryResult[0] || {last_processed_block_number: FIRST_SEARCH_BLOCK};

        return Math.min(Number(lastKnownBlock.last_processed_block_number) + 1, latestBlockWithOffset - START_BLOCK_OFFSET);
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
            await queryRunner.manager.query(`DELETE FROM events.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock}`);
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
