import { web3Factory } from '@0x/dev-utils';
import { Web3ProviderEngine } from '@0x/subproviders';
import { logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import 'reflect-metadata';
import { Connection } from 'typeorm';

import { EventsSource } from '../data_sources/events/0x_events';
import { PullAndSaveEvents } from './utils';

import * as config from "../../config/defaults.json";

const BLOCK_FINALITY_THRESHOLD = config.blockFinalityThreshold; // When to consider blocks as final. Used to compute default endBlock.

const provider = web3Factory.getRpcProvider({
    rpcUrl: process.env.WEB3_ENDPOINT,
});
const eventsSource = new EventsSource(provider, config.network);
const pullAndSaveEvents = new PullAndSaveEvents(eventsSource);

export class EventScraper {
    public async getParseSaveEventsAsync(connection: Connection): Promise<void> {
        logUtils.log(`pulling events`);
        const latestBlockWithOffset = await calculateEndBlockAsync(provider);
        
        await Promise.all([
            pullAndSaveEvents.getParseSaveFillEventsAsync(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveStakeEventsAsync(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveUnstakeEventsAsync(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveMoveStakeEventsAsync(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveStakingPoolCreatedEventsAsync(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveStakingPoolEarnedRewardsInEpochEventsAsync(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveMakerStakingPoolSetEventsAsync(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveParamsSetEventsAsync(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveOperatorShareDecreasedEventsAsync(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveEpochEndedEventsAsync(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveEpochFinalizedEventsAsync(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveRewardsPaidEventsAsync(connection, latestBlockWithOffset),        ]
        );
        logUtils.log(`finished pulling events`);
    };
};

async function calculateEndBlockAsync(provider: Web3ProviderEngine): Promise<number> {
    const web3Wrapper = new Web3Wrapper(provider);
    const currentBlock = await web3Wrapper.getBlockNumberAsync();
    return currentBlock - BLOCK_FINALITY_THRESHOLD;
}
