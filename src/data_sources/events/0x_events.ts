//import {
//    ContractWrappers,
//    ExchangeContract,
//    ExchangeEventArgs,
//    ExchangeEvents,
//    ExchangeFillEventArgs,
//} from '@0x/contract-wrappers';
import { Web3ProviderEngine } from '@0x/subproviders';
import { LogWithDecodedArgs } from 'ethereum-types';
// import {
//     StakingContract,
//     StakingEventArgs,
//     StakingEvents,
//     StakingStakeEventArgs,
//     StakingUnstakeEventArgs,
//     StakingMoveStakeEventArgs,
//     StakingStakingPoolCreatedEventArgs,
//     StakingOperatorShareDecreasedEventArgs,
//     StakingEpochEndedEventArgs,
//     StakingEpochFinalizedEventArgs,
//     StakingRewardsPaidEventArgs,
// } from '@0x/contracts-staking';
import { getContractAddressesForNetworkOrThrow } from '@0x/contract-addresses';

import {
    ExchangeContract,
    ExchangeEventArgs,
    ExchangeEvents,
    ExchangeFillEventArgs,
    StakingContract,
    StakingEventArgs,
    StakingEvents,
    StakingStakeEventArgs,
    StakingUnstakeEventArgs,
    StakingMoveStakeEventArgs,
    StakingStakingPoolCreatedEventArgs,
    StakingOperatorShareDecreasedEventArgs,
    StakingEpochEndedEventArgs,
    StakingEpochFinalizedEventArgs,
    StakingRewardsPaidEventArgs,
} from '@0x/abi-gen-wrappers';


import { getEventsWithPaginationAsync, GetEventsFunc } from './utils';

export type DecodedEvent = 
    LogWithDecodedArgs<ExchangeFillEventArgs> |
    LogWithDecodedArgs<StakingStakeEventArgs> |
    LogWithDecodedArgs<StakingUnstakeEventArgs> |
    LogWithDecodedArgs<StakingStakingPoolCreatedEventArgs>;

const stakingAddress = '0x89150f5eed50b3528f79bfb539f29d727f92821c';
const exchangeAddress = '0xca8b1626b3b7a0da722ca9f264c4630c7d34d3b8';

export class EventsSource {
    private readonly _exchangeWrapper: ExchangeContract;
    private readonly _stakingWrapper: StakingContract;
    constructor(provider: Web3ProviderEngine, networkId: number) {
        //const contractWrappers = new ContractWrappers(provider, { networkId });
        const contractAddresses = getContractAddressesForNetworkOrThrow(networkId);
        this._exchangeWrapper = new ExchangeContract(exchangeAddress, provider);
        this._stakingWrapper = new StakingContract(stakingAddress, provider);
    }

    public async getFillEventsAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<Array<LogWithDecodedArgs<ExchangeFillEventArgs>>> {
        const getterFunction = this._makeGetterFuncForExchangeEventType<ExchangeFillEventArgs>(
            ExchangeEvents.Fill,
        );
        return getEventsWithPaginationAsync(getterFunction, startBlock, endBlock);
    }

    public async getStakeEventsAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<Array<LogWithDecodedArgs<StakingStakeEventArgs>>> {
        const getterFunction = this._makeGetterFuncForStakingEventType<StakingStakeEventArgs>(
            StakingEvents.Stake,
        );
        return getEventsWithPaginationAsync(getterFunction, startBlock, endBlock);
    }

    public async getUnstakeEventsAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<Array<LogWithDecodedArgs<StakingUnstakeEventArgs>>> {
        const getterFunction = this._makeGetterFuncForStakingEventType<StakingUnstakeEventArgs>(
            StakingEvents.Unstake,
        );
        return getEventsWithPaginationAsync(getterFunction, startBlock, endBlock);
    }

    public async getMoveStakeEventsAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<Array<LogWithDecodedArgs<StakingMoveStakeEventArgs>>> {
        const getterFunction = this._makeGetterFuncForStakingEventType<StakingMoveStakeEventArgs>(
            StakingEvents.MoveStake,
        );
        return getEventsWithPaginationAsync(getterFunction, startBlock, endBlock);
    }

    public async getStakingPoolCreatedEventsAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<Array<LogWithDecodedArgs<StakingStakingPoolCreatedEventArgs>>> {
        const getterFunction = this._makeGetterFuncForStakingEventType<StakingStakingPoolCreatedEventArgs>(
            StakingEvents.StakingPoolCreated,
        );
        return getEventsWithPaginationAsync(getterFunction, startBlock, endBlock);
    }

    public async getOperatorShareDecreasedEventsAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<Array<LogWithDecodedArgs<StakingOperatorShareDecreasedEventArgs>>> {
        const getterFunction = this._makeGetterFuncForStakingEventType<StakingOperatorShareDecreasedEventArgs>(
            StakingEvents.OperatorShareDecreased,
        );
        return getEventsWithPaginationAsync(getterFunction, startBlock, endBlock);
    }

    public async getEpochEndedEventsAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<Array<LogWithDecodedArgs<StakingEpochEndedEventArgs>>> {
        const getterFunction = this._makeGetterFuncForStakingEventType<StakingEpochEndedEventArgs>(
            StakingEvents.EpochEnded,
        );
        return getEventsWithPaginationAsync(getterFunction, startBlock, endBlock);
    }

    public async getEpochFinalizedEventsAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<Array<LogWithDecodedArgs<StakingEpochFinalizedEventArgs>>> {
        const getterFunction = this._makeGetterFuncForStakingEventType<StakingEpochFinalizedEventArgs>(
            StakingEvents.EpochFinalized,
        );
        return getEventsWithPaginationAsync(getterFunction, startBlock, endBlock);
    }

    public async getRewardsPaidEventsAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<LogWithDecodedArgs<StakingRewardsPaidEventArgs>[]> {
        const getterFunction = this._makeGetterFuncForStakingEventType<StakingRewardsPaidEventArgs>(
            StakingEvents.RewardsPaid,
        );
        return getEventsWithPaginationAsync(getterFunction, startBlock, endBlock);
    }

    // Returns a getter function which gets all Staking events of a specific type for a
    // specific sub-range. This getter function will be called during each step
    // of pagination.
    private _makeGetterFuncForStakingEventType<ArgsType extends StakingEventArgs>(
        eventType: StakingEvents,
    ): GetEventsFunc<ArgsType> {
        return async (fromBlock: number, toBlock: number) =>
            this._stakingWrapper.getLogsAsync<ArgsType>(eventType, { fromBlock, toBlock }, {});
    }

    // Returns a getter function which gets all Exchange events of a specific type for a
    // specific sub-range. This getter function will be called during each step
    // of pagination.
    private _makeGetterFuncForExchangeEventType<ArgsType extends ExchangeEventArgs>(
        eventType: ExchangeEvents,
    ): GetEventsFunc<ArgsType> {
        return async (fromBlock: number, toBlock: number) =>
            this._exchangeWrapper.getLogsAsync<ArgsType>(eventType, { fromBlock, toBlock }, {});
    }
}
