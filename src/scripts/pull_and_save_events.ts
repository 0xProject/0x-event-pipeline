import { web3Factory } from '@0x/dev-utils';
import { Web3ProviderEngine } from '@0x/subproviders';
import { logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import 'reflect-metadata';
import { Connection } from 'typeorm';

import { EventsSource } from '../data_sources/events/0x_events';
import { StakingPoolCreatedEvent, LastBlockProcessed, FillEvent } from '../entities';

import { parseFillEvent } from '../parsers/events/fill_events';
import { parseStakingPoolCreatedEvent } from '../parsers/events/staking_events';

import * as config from "../../config/defaults.json";

const BLOCK_FINALITY_THRESHOLD = config.blockFinalityThreshold; // When to consider blocks as final. Used to compute default endBlock.

const provider = web3Factory.getRpcProvider({
    rpcUrl: process.env.WEB3_ENDPOINT,
});
const eventsSource = new EventsSource(provider, config.network);

export class EventScraper {
    public async getParseSaveEventsAsync(connection: Connection): Promise<void> {
        logUtils.log(`pulling events`);
        const latestBlockWithOffset = await calculateEndBlockAsync(provider);
        
        await Promise.all([
            getParseSaveFillEventsAsync(connection, latestBlockWithOffset),
            getParseSaveStakingPoolCreatedEventsAsync(connection, latestBlockWithOffset),
        ]
        );
        logUtils.log(`finished pulling events`);
    };
};

async function getParseSaveStakingPoolCreatedEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
    const eventName = 'stakingPoolCreated';
    const startBlock = await getStartBlockAsync(eventName, connection);
    const endBlock = Math.min(latestBlockWithOffset, startBlock + config.maxBlocksToSearch);
    logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
    const eventLogs= await eventsSource.getStakingPoolCreatedEventsAsync(startBlock, endBlock);
    const parsedEventLogs = eventLogs.map(log => parseStakingPoolCreatedEvent(log));
    const repository = connection.getRepository(StakingPoolCreatedEvent);
    const lastUpdateRepo = connection.getRepository(LastBlockProcessed);
    logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    await repository.save(parsedEventLogs);
    await lastUpdateRepo.save({eventName: eventName, lastProcessedBlockNumber: endBlock, processedTimestamp: new Date().getTime() });
    await updateLastProcessedBlockAsync(eventName, connection, endBlock);
}

async function getParseSaveFillEventsAsync(connection: Connection, latestBlockWithOffset: number): Promise<void> {
    const eventName = 'fill';
    const startBlock = await getStartBlockAsync(eventName, connection);
    const endBlock = Math.min(latestBlockWithOffset, startBlock + config.maxBlocksToSearch);
    logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);
    const eventLogs= await eventsSource.getFillEventsAsync(startBlock, endBlock);
    const parsedEventLogs = eventLogs.map(log => parseFillEvent(log));
    const repository = connection.getRepository(FillEvent);
    logUtils.log(`saving ${parsedEventLogs.length} ${eventName} events`);
    await repository.save(parsedEventLogs);
    await updateLastProcessedBlockAsync(eventName, connection, endBlock);
}

async function updateLastProcessedBlockAsync(eventName: string, connection: Connection, endBlock: number): Promise<void> {
    const lastUpdateRepo = connection.getRepository(LastBlockProcessed);

    await lastUpdateRepo.save({eventName: eventName, lastProcessedBlockNumber: endBlock, processedTimestamp: new Date().getTime() });
}

async function getStartBlockAsync(eventName: string, connection: Connection): Promise<number> {
    const queryResult = await connection.query(
        `SELECT last_processed_block_number FROM events.last_block_processed WHERE event_name = '${eventName}'`,
    );

    logUtils.log(queryResult);
    const lastKnownBlock = queryResult[0] || {last_processed_block_number: config.firstSearchBlock};
    return lastKnownBlock.last_processed_block_number - config.startBlockOffset;
}

async function calculateEndBlockAsync(provider: Web3ProviderEngine): Promise<number> {
    const web3Wrapper = new Web3Wrapper(provider);
    const currentBlock = await web3Wrapper.getBlockNumberAsync();
    return currentBlock - BLOCK_FINALITY_THRESHOLD;
}
