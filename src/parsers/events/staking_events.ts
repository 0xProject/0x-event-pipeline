import { 
        StakeEvent,
        UnstakeEvent,
        MoveStakeEvent,
        EpochEndedEvent,
        StakingPoolCreatedEvent,
} from '../../entities';
import { parseEvent } from './parse_event';
import {
    StakingStakeEventArgs,
    StakingUnstakeEventArgs,
    StakingMoveStakeEventArgs,
    StakingEpochEndedEventArgs,
    StakingStakingPoolCreatedEventArgs,
} from '@0x/contracts-staking';
import { BigNumber, logUtils } from '@0x/utils';
import { LogWithDecodedArgs } from 'ethereum-types';

/**
 * Converts a raw event log for a stake event into an StakeEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseStakeEvent(eventLog: LogWithDecodedArgs<StakingStakeEventArgs>): StakeEvent {
    const stakeEvent = new StakeEvent();
    parseEvent(eventLog, stakeEvent);

    stakeEvent.staker = eventLog.args.staker;
    stakeEvent.amount = new BigNumber(eventLog.args.amount);

    return stakeEvent;
}

/**
 * Converts a raw event log for a unstake event into an UnstakeEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseUnstakeEvent(eventLog: LogWithDecodedArgs<StakingUnstakeEventArgs>): UnstakeEvent {
    const unstakeEvent = new UnstakeEvent();
    parseEvent(eventLog, unstakeEvent);

    unstakeEvent.staker = eventLog.args.staker;
    unstakeEvent.amount = new BigNumber(eventLog.args.amount);

    return unstakeEvent;
}

/**
 * Converts a raw event log for a moveStake event into an MoveStakeEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseMoveStakeEvent(eventLog: LogWithDecodedArgs<StakingMoveStakeEventArgs>): MoveStakeEvent {
    const moveStakeEvent = new MoveStakeEvent();
    parseEvent(eventLog, moveStakeEvent);

    moveStakeEvent.staker = eventLog.args.staker;
    moveStakeEvent.amount = new BigNumber(eventLog.args.amount);
    moveStakeEvent.fromStatus = eventLog.args.fromStatus;
    moveStakeEvent.fromPool = eventLog.args.fromPool;
    moveStakeEvent.fromStatus = eventLog.args.fromStatus;
    moveStakeEvent.toPool = eventLog.args.toPool;

    return moveStakeEvent;
}

/**
 * Converts a raw event log for a moveStake event into an MoveStakeEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseEpochEndedEvent(eventLog: LogWithDecodedArgs<StakingEpochEndedEventArgs>): EpochEndedEvent {
    const epochEndedEvent = new EpochEndedEvent();
    parseEvent(eventLog, epochEndedEvent);

    epochEndedEvent.epochId = Number(eventLog.args.epoch);
    epochEndedEvent.numPoolsToFinalize = Number(eventLog.args.numPoolsToFinalize);
    epochEndedEvent.rewardsAvailable = new BigNumber(eventLog.args.rewardsAvailable);
    epochEndedEvent.totalFeesCollected = new BigNumber(eventLog.args.totalFeesCollected);
    epochEndedEvent.totalWeightedStake = new BigNumber(eventLog.args.totalWeightedStake);

    return epochEndedEvent;
}


/**
 * Converts a raw event log for a stakingPoolCreated event into an StakingPoolCreatedEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseStakingPoolCreatedEvent(eventLog: LogWithDecodedArgs<StakingStakingPoolCreatedEventArgs>): StakingPoolCreatedEvent {
    const stakingPoolCreatedEvent = new StakingPoolCreatedEvent();
    parseEvent(eventLog, stakingPoolCreatedEvent);

    stakingPoolCreatedEvent.poolId = eventLog.args.poolId;
    stakingPoolCreatedEvent.operatorAddress = eventLog.args.operator;
    stakingPoolCreatedEvent.operatorShare = eventLog.args.operatorShare;

    return stakingPoolCreatedEvent;
}
