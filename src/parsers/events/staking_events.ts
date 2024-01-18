import {
    STAKING_STAKE_ABI,
    STAKING_UNSTAKE_ABI,
    STAKING_EPOCH_ENDED_ABI,
    STAKING_MAKER_STAKING_POOL_SET_ABI,
    STAKING_OPERATOR_SHARE_DECREASED_ABI,
    STAKING_MOVE_STAKE_ABI,
    STAKING_EPOCH_FINALIZED_ABI,
    STAKING_STAKING_POOL_CREATED_ABI,
    STAKING_REWARDS_PAID_ABI,
    STAKING_PARAMS_SET_ABI,
    STAKING_STAKING_POOL_EARNED_REWARDS_IN_EPOCH_ABI,
} from '../../constants';
import {
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
    UnstakeEvent,
} from '../../entities';
import { parseEvent } from './parse_event';
import { BigNumber } from '@0x/utils';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

/**
 * Converts a raw event log for a stake event into an StakeEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseStakeEvent(eventLog: LogEntry): StakeEvent {
    const parsedEvent = new StakeEvent();
    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(
        STAKING_STAKE_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    parsedEvent.staker = decodedLog.staker.toLowerCase();
    parsedEvent.amount = new BigNumber(decodedLog.amount);

    return parsedEvent;
}

/**
 * Converts a raw event log for a unstake event into an UnstakeEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseUnstakeEvent(eventLog: LogEntry): UnstakeEvent {
    const parsedEvent = new UnstakeEvent();
    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(
        STAKING_UNSTAKE_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    parsedEvent.staker = decodedLog.staker.toLowerCase();
    parsedEvent.amount = new BigNumber(decodedLog.amount);

    return parsedEvent;
}

/**
 * Converts a raw event log for a moveStake event into an MoveStakeEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseMoveStakeEvent(eventLog: LogEntry): MoveStakeEvent {
    const parsedEvent = new MoveStakeEvent();
    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(
        STAKING_MOVE_STAKE_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    parsedEvent.staker = decodedLog.staker.toLowerCase();
    parsedEvent.amount = new BigNumber(decodedLog.amount);
    parsedEvent.fromStatus = decodedLog.fromStatus;
    parsedEvent.fromPool = String(Number(decodedLog.fromPool));
    parsedEvent.toStatus = decodedLog.toStatus;
    parsedEvent.toPool = String(Number(decodedLog.toPool));

    return parsedEvent;
}

/**
 * Converts a raw event log for a stakingPoolCreated event into an StakingPoolCreatedEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseStakingPoolCreatedEvent(eventLog: LogEntry): StakingPoolCreatedEvent {
    const parsedEvent = new StakingPoolCreatedEvent();
    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(
        STAKING_STAKING_POOL_CREATED_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    parsedEvent.poolId = String(Number(decodedLog.poolId));
    parsedEvent.operatorAddress = decodedLog.operator.toLowerCase();
    parsedEvent.operatorShare = decodedLog.operatorShare;

    return parsedEvent;
}

/**
 * Converts a raw event log for a stakingPoolEarnedRewardsInEpoch event into an StakingPoolEarnedRewardsInEpochEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseStakingPoolEarnedRewardsInEpochEvent(eventLog: LogEntry): StakingPoolEarnedRewardsInEpochEvent {
    const parsedEvent = new StakingPoolEarnedRewardsInEpochEvent();
    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(
        STAKING_STAKING_POOL_EARNED_REWARDS_IN_EPOCH_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    parsedEvent.epochId = Number(decodedLog.epoch);
    parsedEvent.poolId = String(Number(decodedLog.poolId));

    return parsedEvent;
}

/**
 * Converts a raw event log for a makerStakingPoolSet event into an MakerStakingPoolSetEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseMakerStakingPoolSetEvent(eventLog: LogEntry): MakerStakingPoolSetEvent {
    const parsedEvent = new MakerStakingPoolSetEvent();
    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(
        STAKING_MAKER_STAKING_POOL_SET_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    parsedEvent.makerAddress = decodedLog.makerAddress.toLowerCase();
    parsedEvent.poolId = String(Number(decodedLog.poolId));

    return parsedEvent;
}

/**
 * Converts a raw event log for a paramsSet event into an ParamsSetEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseParamsSetEvent(eventLog: LogEntry): ParamsSetEvent {
    const parsedEvent = new ParamsSetEvent();
    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(
        STAKING_PARAMS_SET_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    parsedEvent.epochDurationInSeconds = Number(decodedLog.epochDurationInSeconds);
    parsedEvent.rewardDelegatedStakeWeight = decodedLog.rewardDelegatedStakeWeight;
    parsedEvent.minimumPoolStake = decodedLog.minimumPoolStake;
    parsedEvent.cobbDouglasAlphaNumerator = Number(decodedLog.cobbDouglasAlphaNumerator);
    parsedEvent.cobbDouglasAlphaDenominator = Number(decodedLog.cobbDouglasAlphaDenominator);

    return parsedEvent;
}

/**
 * Converts a raw event log for a operatorShareDecreased event into an OperatorShareDecreasedEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseOperatorShareDecreasedEvent(eventLog: LogEntry): OperatorShareDecreasedEvent {
    const parsedEvent = new OperatorShareDecreasedEvent();
    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(
        STAKING_OPERATOR_SHARE_DECREASED_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    parsedEvent.poolId = String(Number(decodedLog.poolId));
    parsedEvent.oldOperatorShare = decodedLog.oldOperatorShare;
    parsedEvent.newOperatorShare = decodedLog.newOperatorShare;

    return parsedEvent;
}

/**
 * Converts a raw event log for a epochEnded event into an EpochEndedEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseEpochEndedEvent(eventLog: LogEntry): EpochEndedEvent {
    const parsedEvent = new EpochEndedEvent();
    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(
        STAKING_EPOCH_ENDED_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    parsedEvent.epochId = Number(decodedLog.epoch);
    parsedEvent.numPoolsToFinalize = Number(decodedLog.numPoolsToFinalize);
    parsedEvent.rewardsAvailable = new BigNumber(decodedLog.rewardsAvailable);
    parsedEvent.totalFeesCollected = new BigNumber(decodedLog.totalFeesCollected);
    parsedEvent.totalWeightedStake = new BigNumber(decodedLog.totalWeightedStake);

    return parsedEvent;
}

/**
 * Converts a raw event log for a epochFinalized event into an EpochFinalizedEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseEpochFinalizedEvent(eventLog: LogEntry): EpochFinalizedEvent {
    const parsedEvent = new EpochFinalizedEvent();
    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(
        STAKING_EPOCH_FINALIZED_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    parsedEvent.epochId = Number(decodedLog.epoch);
    parsedEvent.rewardsPaid = new BigNumber(decodedLog.rewardsPaid);
    parsedEvent.rewardsRemaining = new BigNumber(decodedLog.rewardsRemaining);

    return parsedEvent;
}

/**
 * Converts a raw event log for a rewardsPaid event into an EpochFinalizedEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseRewardsPaidEvent(eventLog: LogEntry): RewardsPaidEvent {
    const parsedEvent = new RewardsPaidEvent();
    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(
        STAKING_REWARDS_PAID_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    parsedEvent.epochId = Number(decodedLog.epoch);
    parsedEvent.poolId = String(Number(decodedLog.poolId));
    parsedEvent.operatorReward = new BigNumber(decodedLog.operatorReward);
    parsedEvent.membersReward = new BigNumber(decodedLog.membersReward);

    return parsedEvent;
}
