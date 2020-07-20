import { web3Factory } from '@0x/dev-utils';
import { Web3ProviderEngine } from '@0x/subproviders';
import { logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import 'reflect-metadata';
import { Connection } from 'typeorm';

import { PullAndSaveEvents } from './utils/event_utils';
import { PullAndSaveWeb3 } from './utils/web3_utils';

import { EventsSource } from '../data_sources/events/0x_events';
import { Web3Source } from '../data_sources/web3';
import { BLOCK_FINALITY_THRESHOLD, CHAIN_ID, ETHEREUM_RPC_URL } from '../config';

import {
    ExchangeFillEventArgs,
    StakingStakeEventArgs,
    StakingUnstakeEventArgs,
    StakingMoveStakeEventArgs,
    StakingStakingPoolCreatedEventArgs,
    StakingStakingPoolEarnedRewardsInEpochEventArgs,
    StakingMakerStakingPoolSetEventArgs,
    StakingParamsSetEventArgs,
    StakingOperatorShareDecreasedEventArgs,
    StakingEpochEndedEventArgs,
    StakingEpochFinalizedEventArgs,
    StakingRewardsPaidEventArgs
} from '@0x/contract-wrappers';

import { parseFillEvent } from '../parsers/events/fill_events';
import {
    FillEvent,
    StakingPoolCreatedEvent,
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
} from '../entities';
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
} from '../parsers/events/staking_events';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});
const eventsSource = new EventsSource(provider, CHAIN_ID);
const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);
const pullAndSaveEvents = new PullAndSaveEvents();
const pullAndSaveWeb3 = new PullAndSaveWeb3(web3Source);

export class EventScraper {
    public async getParseSaveEventsAsync(connection: Connection): Promise<void> {
        const startTime = new Date().getTime();
        logUtils.log(`pulling events`);
        const latestBlockWithOffset = await calculateEndBlockAsync(provider);

        logUtils.log(`latest block with offset: ${latestBlockWithOffset}`);

        await Promise.all([
            pullAndSaveWeb3.getParseSaveBlocks(connection, latestBlockWithOffset),
            pullAndSaveWeb3.getParseSaveTx(connection, latestBlockWithOffset),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<ExchangeFillEventArgs, FillEvent>(connection, latestBlockWithOffset, 'FillEvent', 'fill_events', eventsSource.getFillEventsAsync.bind(eventsSource), parseFillEvent),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingStakeEventArgs, StakeEvent>(connection, latestBlockWithOffset, 'StakeEvent', 'stake_events', eventsSource.getStakeEventsAsync.bind(eventsSource), parseStakeEvent),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingUnstakeEventArgs, UnstakeEvent>(connection, latestBlockWithOffset, 'UnstakeEvent', 'unstake_events', eventsSource.getUnstakeEventsAsync.bind(eventsSource), parseUnstakeEvent),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingMoveStakeEventArgs, MoveStakeEvent>(connection, latestBlockWithOffset, 'MoveStake', 'move_stake_events', eventsSource.getMoveStakeEventsAsync.bind(eventsSource), parseMoveStakeEvent),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingStakingPoolCreatedEventArgs, StakingPoolCreatedEvent>(connection, latestBlockWithOffset, 'StakingPoolCreated', 'staking_pool_created_events', eventsSource.getStakingPoolCreatedEventsAsync.bind(eventsSource), parseStakingPoolCreatedEvent),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingStakingPoolEarnedRewardsInEpochEventArgs, StakingPoolEarnedRewardsInEpochEvent>(connection, latestBlockWithOffset, 'StakingPoolEarnedRewardsInEpoch', 'staking_pool_earned_rewards_in_epoch_events', eventsSource.getStakingPoolEarnedRewardsInEpochEventsAsync.bind(eventsSource), parseStakingPoolEarnedRewardsInEpochEvent),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingMakerStakingPoolSetEventArgs, MakerStakingPoolSetEvent>(connection, latestBlockWithOffset, 'MakerStakingPoolSet', 'maker_staking_pool_set_events', eventsSource.getMakerStakingPoolSetEventsAsync.bind(eventsSource), parseMakerStakingPoolSetEvent),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingParamsSetEventArgs, ParamsSetEvent>(connection, latestBlockWithOffset, 'ParamsSet', 'params_set_events', eventsSource.getParamsSetEventsAsync.bind(eventsSource), parseParamsSetEvent),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingOperatorShareDecreasedEventArgs, OperatorShareDecreasedEvent>(connection, latestBlockWithOffset, 'OperatorShareDecreased', 'operator_share_decreased_events', eventsSource.getOperatorShareDecreasedEventsAsync.bind(eventsSource), parseOperatorShareDecreasedEvent),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingEpochEndedEventArgs, EpochEndedEvent>(connection, latestBlockWithOffset, 'EpochEnded', 'epoch_ended_events', eventsSource.getEpochEndedEventsAsync.bind(eventsSource), parseEpochEndedEvent),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingEpochFinalizedEventArgs, EpochFinalizedEvent>(connection, latestBlockWithOffset, 'EpochFinalized', 'epoch_finalized_events', eventsSource.getEpochFinalizedEventsAsync.bind(eventsSource), parseEpochFinalizedEvent),
            pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingRewardsPaidEventArgs, RewardsPaidEvent>(connection, latestBlockWithOffset, 'RewardsPaid', 'rewards_paid_events', eventsSource.getRewardsPaidEventsAsync.bind(eventsSource), parseRewardsPaidEvent),
        ]);
    
        const endTime = new Date().getTime();
        logUtils.log(`finished pulling events and blocks`);
        logUtils.log(`It took ${(endTime - startTime) / 1000 } seconds to complete`);
    };
};

async function calculateEndBlockAsync(provider: Web3ProviderEngine): Promise<number> {
    const web3Wrapper = new Web3Wrapper(provider);
    const currentBlock = await web3Wrapper.getBlockNumberAsync();
    return currentBlock - BLOCK_FINALITY_THRESHOLD;
}
