import { web3Factory } from '@0x/dev-utils';
import { Web3ProviderEngine } from '@0x/subproviders';
import { logger } from '../utils/logger';
import { Web3Wrapper } from '@0x/web3-wrapper';
import 'reflect-metadata';
import { Connection } from 'typeorm';

import {
    ExchangeCancelEventArgs,
    ExchangeCancelUpToEventArgs,
    ExchangeTransactionExecutionEventArgs,
    StakingEpochEndedEventArgs,
    StakingEpochFinalizedEventArgs,
    StakingMakerStakingPoolSetEventArgs,
    StakingMoveStakeEventArgs,
    StakingOperatorShareDecreasedEventArgs,
    StakingParamsSetEventArgs,
    StakingRewardsPaidEventArgs,
    StakingStakeEventArgs,
    StakingStakingPoolCreatedEventArgs,
    StakingStakingPoolEarnedRewardsInEpochEventArgs,
    StakingUnstakeEventArgs,
} from '@0x/contract-wrappers';
import { parseCancelEvent, parseCancelUpToEvent } from '../parsers/events/cancel_events';
import { parseTransactionExecutionEvent } from '../parsers/events/transaction_execution_events';
import { EventsSource } from '../data_sources/events/0x_events';
import {
    CancelEvent,
    CancelUpToEvent,
    EpochEndedEvent,
    EpochFinalizedEvent,
    MakerStakingPoolSetEvent,
    MoveStakeEvent,
    OperatorShareDecreasedEvent,
    ParamsSetEvent,
    RewardsPaidEvent,
    StakeEvent,
    StakingPoolCreatedEvent,
    StakingPoolEarnedRewardsInEpochEvent,
    TransactionExecutionEvent,
    UnstakeEvent,
} from '../entities';
import {
    parseEpochEndedEvent,
    parseEpochFinalizedEvent,
    parseMakerStakingPoolSetEvent,
    parseMoveStakeEvent,
    parseOperatorShareDecreasedEvent,
    parseParamsSetEvent,
    parseRewardsPaidEvent,
    parseStakeEvent,
    parseStakingPoolCreatedEvent,
    parseStakingPoolEarnedRewardsInEpochEvent,
    parseUnstakeEvent,
} from '../parsers/events/staking_events';

import { PullAndSaveEvents } from './utils/event_utils';
import { PullAndSaveWeb3 } from './utils/web3_utils';
import { Web3Source } from '../data_sources/events/web3';
import { BLOCK_FINALITY_THRESHOLD, CHAIN_ID, ETHEREUM_RPC_URL, FEAT_CANCEL_EVENTS, FEAT_STAKING } from '../config';

import { SCRIPT_RUN_DURATION } from '../utils/metrics';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});

const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);
const eventsSource = new EventsSource(provider, CHAIN_ID);
const pullAndSaveEvents = new PullAndSaveEvents();

export class LegacyEventScraper {
    public async getParseSaveEventsAsync(connection: Connection): Promise<void> {
        const startTime = new Date().getTime();
        logger.info(`pulling legacy events`);
        const latestBlockWithOffset = await calculateEndBlockAsync(provider);

        logger.info(`latest block with offset: ${latestBlockWithOffset}`);

        const promises: Promise<void>[] = [];

        if (FEAT_CANCEL_EVENTS) {
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<ExchangeCancelEventArgs, CancelEvent>(
                    connection,
                    latestBlockWithOffset,
                    'CancelEvent',
                    'cancel_events',
                    eventsSource.getCancelEventsAsync.bind(eventsSource),
                    parseCancelEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<ExchangeCancelUpToEventArgs, CancelUpToEvent>(
                    connection,
                    latestBlockWithOffset,
                    'CancelUpToEvent',
                    'cancel_up_to_events',
                    eventsSource.getCancelUpToEventsAsync.bind(eventsSource),
                    parseCancelUpToEvent,
                ),
            );
        }

        if (FEAT_STAKING) {
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<
                    ExchangeTransactionExecutionEventArgs,
                    TransactionExecutionEvent
                >(
                    connection,
                    latestBlockWithOffset,
                    'TransactionExecutionEvent',
                    'transaction_execution_events',
                    eventsSource.getTransactionExecutionEventsAsync.bind(eventsSource),
                    parseTransactionExecutionEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingStakeEventArgs, StakeEvent>(
                    connection,
                    latestBlockWithOffset,
                    'StakeEvent',
                    'stake_events',
                    eventsSource.getStakeEventsAsync.bind(eventsSource),
                    parseStakeEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingUnstakeEventArgs, UnstakeEvent>(
                    connection,
                    latestBlockWithOffset,
                    'UnstakeEvent',
                    'unstake_events',
                    eventsSource.getUnstakeEventsAsync.bind(eventsSource),
                    parseUnstakeEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingMoveStakeEventArgs, MoveStakeEvent>(
                    connection,
                    latestBlockWithOffset,
                    'MoveStake',
                    'move_stake_events',
                    eventsSource.getMoveStakeEventsAsync.bind(eventsSource),
                    parseMoveStakeEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<
                    StakingStakingPoolCreatedEventArgs,
                    StakingPoolCreatedEvent
                >(
                    connection,
                    latestBlockWithOffset,
                    'StakingPoolCreated',
                    'staking_pool_created_events',
                    eventsSource.getStakingPoolCreatedEventsAsync.bind(eventsSource),
                    parseStakingPoolCreatedEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<
                    StakingStakingPoolEarnedRewardsInEpochEventArgs,
                    StakingPoolEarnedRewardsInEpochEvent
                >(
                    connection,
                    latestBlockWithOffset,
                    'StakingPoolEarnedRewardsInEpoch',
                    'staking_pool_earned_rewards_in_epoch_events',
                    eventsSource.getStakingPoolEarnedRewardsInEpochEventsAsync.bind(eventsSource),
                    parseStakingPoolEarnedRewardsInEpochEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<
                    StakingMakerStakingPoolSetEventArgs,
                    MakerStakingPoolSetEvent
                >(
                    connection,
                    latestBlockWithOffset,
                    'MakerStakingPoolSet',
                    'maker_staking_pool_set_events',
                    eventsSource.getMakerStakingPoolSetEventsAsync.bind(eventsSource),
                    parseMakerStakingPoolSetEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingParamsSetEventArgs, ParamsSetEvent>(
                    connection,
                    latestBlockWithOffset,
                    'ParamsSet',
                    'params_set_events',
                    eventsSource.getParamsSetEventsAsync.bind(eventsSource),
                    parseParamsSetEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<
                    StakingOperatorShareDecreasedEventArgs,
                    OperatorShareDecreasedEvent
                >(
                    connection,
                    latestBlockWithOffset,
                    'OperatorShareDecreased',
                    'operator_share_decreased_events',
                    eventsSource.getOperatorShareDecreasedEventsAsync.bind(eventsSource),
                    parseOperatorShareDecreasedEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingEpochEndedEventArgs, EpochEndedEvent>(
                    connection,
                    latestBlockWithOffset,
                    'EpochEnded',
                    'epoch_ended_events',
                    eventsSource.getEpochEndedEventsAsync.bind(eventsSource),
                    parseEpochEndedEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<
                    StakingEpochFinalizedEventArgs,
                    EpochFinalizedEvent
                >(
                    connection,
                    latestBlockWithOffset,
                    'EpochFinalized',
                    'epoch_finalized_events',
                    eventsSource.getEpochFinalizedEventsAsync.bind(eventsSource),
                    parseEpochFinalizedEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingRewardsPaidEventArgs, RewardsPaidEvent>(
                    connection,
                    latestBlockWithOffset,
                    'RewardsPaid',
                    'rewards_paid_events',
                    eventsSource.getRewardsPaidEventsAsync.bind(eventsSource),
                    parseRewardsPaidEvent,
                ),
            );
        }
        await Promise.all(promises);

        const endTime = new Date().getTime();
        const scriptDurationSeconds = (endTime - startTime) / 1000;
        SCRIPT_RUN_DURATION.set({ script: 'events' }, scriptDurationSeconds);

        logger.info(`Finished pulling legacy events in ${scriptDurationSeconds}`);
    }
}

async function calculateEndBlockAsync(provider: Web3ProviderEngine): Promise<number> {
    const web3Wrapper = new Web3Wrapper(provider);
    const currentBlock = await web3Wrapper.getBlockNumberAsync();
    return currentBlock - BLOCK_FINALITY_THRESHOLD;
}
