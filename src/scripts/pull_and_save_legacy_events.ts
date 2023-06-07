import { web3Factory } from '@0x/dev-utils';
import { logger } from '../utils/logger';
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
import { Web3Source } from '../data_sources/events/web3';
import { CHAIN_ID, ETHEREUM_RPC_URL, FEAT_CANCEL_EVENTS, FEAT_STAKING } from '../config';

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
        const currentBlock = await web3Source.getCurrentBlockAsync();

        logger.info(`latest block: ${currentBlock.number}`);

        const promises: Promise<void>[] = [];

        if (FEAT_CANCEL_EVENTS) {
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<ExchangeCancelEventArgs, CancelEvent>(
                    connection,
                    web3Source,
                    currentBlock,
                    'CancelEvent',
                    'cancel_events',
                    eventsSource.getCancelEventsAsync.bind(eventsSource),
                    parseCancelEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<ExchangeCancelUpToEventArgs, CancelUpToEvent>(
                    connection,
                    web3Source,
                    currentBlock,
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
                    web3Source,
                    currentBlock,
                    'TransactionExecutionEvent',
                    'transaction_execution_events',
                    eventsSource.getTransactionExecutionEventsAsync.bind(eventsSource),
                    parseTransactionExecutionEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingStakeEventArgs, StakeEvent>(
                    connection,
                    web3Source,
                    currentBlock,
                    'StakeEvent',
                    'stake_events',
                    eventsSource.getStakeEventsAsync.bind(eventsSource),
                    parseStakeEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingUnstakeEventArgs, UnstakeEvent>(
                    connection,
                    web3Source,
                    currentBlock,
                    'UnstakeEvent',
                    'unstake_events',
                    eventsSource.getUnstakeEventsAsync.bind(eventsSource),
                    parseUnstakeEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingMoveStakeEventArgs, MoveStakeEvent>(
                    connection,
                    web3Source,
                    currentBlock,
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
                    web3Source,
                    currentBlock,
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
                    web3Source,
                    currentBlock,
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
                    web3Source,
                    currentBlock,
                    'MakerStakingPoolSet',
                    'maker_staking_pool_set_events',
                    eventsSource.getMakerStakingPoolSetEventsAsync.bind(eventsSource),
                    parseMakerStakingPoolSetEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingParamsSetEventArgs, ParamsSetEvent>(
                    connection,
                    web3Source,
                    currentBlock,
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
                    web3Source,
                    currentBlock,
                    'OperatorShareDecreased',
                    'operator_share_decreased_events',
                    eventsSource.getOperatorShareDecreasedEventsAsync.bind(eventsSource),
                    parseOperatorShareDecreasedEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingEpochEndedEventArgs, EpochEndedEvent>(
                    connection,
                    web3Source,
                    currentBlock,
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
                    web3Source,
                    currentBlock,
                    'EpochFinalized',
                    'epoch_finalized_events',
                    eventsSource.getEpochFinalizedEventsAsync.bind(eventsSource),
                    parseEpochFinalizedEvent,
                ),
            );
            promises.push(
                pullAndSaveEvents.getParseSaveContractWrapperEventsAsync<StakingRewardsPaidEventArgs, RewardsPaidEvent>(
                    connection,
                    web3Source,
                    currentBlock,
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
        SCRIPT_RUN_DURATION.set({ script: 'legacy-events' }, scriptDurationSeconds);

        logger.info(`Finished pulling legacy events in ${scriptDurationSeconds}`);
    }
}
