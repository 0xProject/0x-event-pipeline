import { 
        StakeEvent,
        UnstakeEvent,
        MoveStakeEvent,
        EpochEndedEvent,
        StakingPoolCreatedEvent,
        StakingPoolEarnedRewardsInEpochEvent,
        MakerStakingPoolSetEvent,
        ParamsSetEvent,
        OperatorShareDecreasedEvent,
        EpochFinalizedEvent,
        RewardsPaidEvent,
} from '../../entities';
import { parseEvent } from './parse_event';
import {
    StakingStakeEventArgs,
    StakingUnstakeEventArgs,
    StakingMoveStakeEventArgs,
    StakingEpochEndedEventArgs,
    StakingStakingPoolCreatedEventArgs,
    StakingStakingPoolEarnedRewardsInEpochEventArgs,
    StakingMakerStakingPoolSetEventArgs,
    StakingParamsSetEventArgs,
    StakingOperatorShareDecreasedEventArgs,
    StakingEpochFinalizedEventArgs,
    StakingRewardsPaidEventArgs,
} from '@0x/contract-wrappers';
import { BigNumber } from '@0x/utils';
import { LogWithDecodedArgs } from 'ethereum-types';

/**
 * Converts a raw event log for a stake event into an StakeEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseStakeEvent(eventLog: LogWithDecodedArgs<StakingStakeEventArgs>): StakeEvent {
    const parsedEvent = new StakeEvent();
    parseEvent(eventLog, parsedEvent);

    parsedEvent.staker = eventLog.args.staker;
    parsedEvent.amount = new BigNumber(eventLog.args.amount);

    return parsedEvent;
}

/**
 * Converts a raw event log for a unstake event into an UnstakeEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseUnstakeEvent(eventLog: LogWithDecodedArgs<StakingUnstakeEventArgs>): UnstakeEvent {
    const parsedEvent = new UnstakeEvent();
    parseEvent(eventLog, parsedEvent);

    parsedEvent.staker = eventLog.args.staker;
    parsedEvent.amount = new BigNumber(eventLog.args.amount);

    return parsedEvent;
}

/**
 * Converts a raw event log for a moveStake event into an MoveStakeEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseMoveStakeEvent(eventLog: LogWithDecodedArgs<StakingMoveStakeEventArgs>): MoveStakeEvent {
    const parsedEvent = new MoveStakeEvent();
    parseEvent(eventLog, parsedEvent);

    parsedEvent.staker = eventLog.args.staker;
    parsedEvent.amount = new BigNumber(eventLog.args.amount);
    parsedEvent.fromStatus = eventLog.args.fromStatus;
    parsedEvent.fromPool = String(Number(eventLog.args.fromPool));
    parsedEvent.toStatus = eventLog.args.toStatus;
    parsedEvent.toPool = String(Number(eventLog.args.toPool));

    return parsedEvent;
}

/**
 * Converts a raw event log for a stakingPoolCreated event into an StakingPoolCreatedEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseStakingPoolCreatedEvent(eventLog: LogWithDecodedArgs<StakingStakingPoolCreatedEventArgs>): StakingPoolCreatedEvent {
    const parsedEvent = new StakingPoolCreatedEvent();
    parseEvent(eventLog, parsedEvent);

    parsedEvent.poolId = String(Number(eventLog.args.poolId));
    parsedEvent.operatorAddress = eventLog.args.operator;
    parsedEvent.operatorShare = eventLog.args.operatorShare;

    return parsedEvent;
}

/**
 * Converts a raw event log for a stakingPoolEarnedRewardsInEpoch event into an StakingPoolEarnedRewardsInEpochEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseStakingPoolEarnedRewardsInEpochEvent(eventLog: LogWithDecodedArgs<StakingStakingPoolEarnedRewardsInEpochEventArgs>): StakingPoolEarnedRewardsInEpochEvent {
    const parsedEvent = new StakingPoolEarnedRewardsInEpochEvent();
    parseEvent(eventLog, parsedEvent);

    parsedEvent.epochId = Number(eventLog.args.epoch);
    parsedEvent.poolId = String(Number(eventLog.args.poolId));

    return parsedEvent;
}

/**
 * Converts a raw event log for a makerStakingPoolSet event into an MakerStakingPoolSetEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseMakerStakingPoolSetEvent(eventLog: LogWithDecodedArgs<StakingMakerStakingPoolSetEventArgs>): MakerStakingPoolSetEvent {
    const parsedEvent = new MakerStakingPoolSetEvent();
    parseEvent(eventLog, parsedEvent);

    parsedEvent.makerAddress = eventLog.args.makerAddress;
    parsedEvent.poolId = String(Number(eventLog.args.poolId));

    return parsedEvent;
}

/**
 * Converts a raw event log for a paramsSet event into an ParamsSetEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseParamsSetEvent(eventLog: LogWithDecodedArgs<StakingParamsSetEventArgs>): ParamsSetEvent {
    const parsedEvent = new ParamsSetEvent();
    parseEvent(eventLog, parsedEvent);

    parsedEvent.epochDurationInSeconds = Number(eventLog.args.epochDurationInSeconds);
    parsedEvent.rewardDelegatedStakeWeight = eventLog.args.rewardDelegatedStakeWeight;
    parsedEvent.minimumPoolStake = eventLog.args.minimumPoolStake;
    parsedEvent.cobbDouglasAlphaNumerator = Number(eventLog.args.cobbDouglasAlphaNumerator);
    parsedEvent.cobbDouglasAlphaDenominator = Number(eventLog.args.cobbDouglasAlphaDenominator);

    return parsedEvent;
}

/**
 * Converts a raw event log for a operatorShareDecreased event into an OperatorShareDecreasedEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseOperatorShareDecreasedEvent(eventLog: LogWithDecodedArgs<StakingOperatorShareDecreasedEventArgs>): OperatorShareDecreasedEvent {
    const parsedEvent = new OperatorShareDecreasedEvent();
    parseEvent(eventLog, parsedEvent);

    parsedEvent.poolId = String(Number(eventLog.args.poolId));
    parsedEvent.oldOperatorShare = eventLog.args.oldOperatorShare;
    parsedEvent.newOperatorShare = eventLog.args.newOperatorShare;

    return parsedEvent;
}


/**
 * Converts a raw event log for a epochEnded event into an EpochEndedEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseEpochEndedEvent(eventLog: LogWithDecodedArgs<StakingEpochEndedEventArgs>): EpochEndedEvent {
    const parsedEvent = new EpochEndedEvent();
    parseEvent(eventLog, parsedEvent);

    parsedEvent.epochId = Number(eventLog.args.epoch);
    parsedEvent.numPoolsToFinalize = Number(eventLog.args.numPoolsToFinalize);
    parsedEvent.rewardsAvailable = new BigNumber(eventLog.args.rewardsAvailable);
    parsedEvent.totalFeesCollected = new BigNumber(eventLog.args.totalFeesCollected);
    parsedEvent.totalWeightedStake = new BigNumber(eventLog.args.totalWeightedStake);

    return parsedEvent;
}

/**
 * Converts a raw event log for a epochFinalized event into an EpochFinalizedEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseEpochFinalizedEvent(eventLog: LogWithDecodedArgs<StakingEpochFinalizedEventArgs>): EpochFinalizedEvent {
    const parsedEvent = new EpochFinalizedEvent();
    parseEvent(eventLog, parsedEvent);

    parsedEvent.epochId = Number(eventLog.args.epoch);
    parsedEvent.rewardsPaid = new BigNumber(eventLog.args.rewardsPaid);
    parsedEvent.rewardsRemaining = new BigNumber(eventLog.args.rewardsRemaining);

    return parsedEvent;
}

/**
 * Converts a raw event log for a rewardsPaid event into an EpochFinalizedEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseRewardsPaidEvent(eventLog: LogWithDecodedArgs<StakingRewardsPaidEventArgs>): RewardsPaidEvent {
    const parsedEvent = new RewardsPaidEvent();
    parseEvent(eventLog, parsedEvent);

    parsedEvent.epochId = Number(eventLog.args.epoch);
    parsedEvent.poolId = String(Number(eventLog.args.poolId));
    parsedEvent.operatorReward = new BigNumber(eventLog.args.operatorReward);
    parsedEvent.membersReward = new BigNumber(eventLog.args.membersReward);

    return parsedEvent;
}

