import * as _ from 'lodash';
const asyncPool = require('tiny-async-pool');

import { getDbAsync } from './db';
import * as queries from './queries';
import {
    AllTimeDelegatorPoolStats,
    AllTimeDelegatorStats,
    AllTimePoolStats,
    AllTimePoolStakedAmounts,
    AllTimeStakingStats,
    DelegatorEvent,
    Epoch,
    EpochDelegatorStats,
    EpochPoolStats,
    EpochWithFees,
    OHLCVData,
    Pool,
    PoolAvgRewards,
    PoolEpochDelegatorStats,
    PoolEpochRewards,
    PoolProtocolFeesGenerated,
    PoolWithStats,
    RawAllTimeDelegatorPoolsStats,
    RawAllTimePoolRewards,
    RawAllTimePoolStakedAmount,
    RawAllTimeStakingStats,
    RawDelegatorDeposited,
    RawDelegatorEvent,
    RawDelegatorStaked,
    RawEpoch,
    RawEpochPoolStats,
    RawEpochWithFees,
    RawPool,
    RawPoolAvgRewards,
    RawPoolEpochRewards,
    RawPoolProtocolFeesGenerated,
    RawPoolTotalProtocolFeesGenerated,
    TransactionDate,
} from './types';
import { arrayToMapWithId } from './utils';

export class QueryRunner {
    public async getEpochNAsync(epochId: number): Promise<Epoch> {
        const rawEpoch: RawEpoch | undefined = _.head(await (await getDbAsync()).query(queries.epochNQuery, [epochId]));
        if (!rawEpoch) {
            throw new Error(`Could not find epoch ${epochId}`);
        }
        const epoch = stakingUtils.getEpochFromRaw(rawEpoch);
        return epoch;
    }

    public async getEpochNWithFeesAsync(epochId: number): Promise<Epoch> {
        const rawEpochWithFees: RawEpochWithFees | undefined = _.head(
            await (await getDbAsync()).query(queries.epochNWithFeesQuery, [epochId]),
        );
        if (!rawEpochWithFees) {
            throw new Error(`Could not find epoch ${epochId}`);
        }
        const epoch = stakingUtils.getEpochWithFeesFromRaw(rawEpochWithFees);
        return epoch;
    }

    public async getCurrentEpochAsync(): Promise<Epoch> {
        const rawEpoch: RawEpoch | undefined = _.head(await (await getDbAsync()).query(queries.currentEpochQuery));
        if (!rawEpoch) {
            throw new Error('Could not find the current epoch.');
        }
        const epoch = stakingUtils.getEpochFromRaw(rawEpoch);
        return epoch;
    }

    public async getCurrentEpochWithFeesAsync(): Promise<EpochWithFees> {
        const rawEpochWithFees: RawEpochWithFees | undefined = _.head(
            await (await getDbAsync()).query(queries.currentEpochWithFeesQuery),
        );
        if (!rawEpochWithFees) {
            throw new Error('Could not find the current epoch.');
        }
        const epoch = stakingUtils.getEpochWithFeesFromRaw(rawEpochWithFees);
        return epoch;
    }

    public async getNextEpochAsync(): Promise<Epoch> {
        const rawEpoch: RawEpoch | undefined = _.head(await (await getDbAsync()).query(queries.nextEpochQuery));
        if (!rawEpoch) {
            throw new Error('Could not find the next epoch.');
        }
        const epoch = stakingUtils.getEpochFromRaw(rawEpoch);
        return epoch;
    }

    public async getNextEpochWithFeesAsync(): Promise<EpochWithFees> {
        const rawEpoch: RawEpochWithFees | undefined = _.head(await (await getDbAsync()).query(queries.nextEpochQuery));
        if (!rawEpoch) {
            throw new Error('Could not find the next epoch.');
        }
        const epoch = stakingUtils.getEpochWithFeesFromRaw(rawEpoch);
        return epoch;
    }

    public async getStakingPoolsAsync(): Promise<Pool[]> {
        const rawPools: RawPool[] = await (await getDbAsync()).query(queries.stakingPoolsQuery);
        const pools = stakingUtils.getPoolsFromRaw(rawPools);
        return pools;
    }

    public async getStakingPoolAsync(poolId: string): Promise<Pool> {
        const rawPool: RawPool | undefined = _.head(
            await (await getDbAsync()).query(queries.stakingPoolByIdQuery, [poolId]),
        );

        if (!rawPool) {
            // TODO (xianny): standardize error types
            throw new Error(`Could not find pool with pool_id ${poolId}`);
            // throw new NotFoundError(`Could not find pool with pool_id ${poolId}`);
        }

        const pool = stakingUtils.getPoolFromRaw(rawPool);
        return pool;
    }

    public async getStakingPoolEpochRewardsAsync(poolId: string): Promise<PoolEpochRewards[]> {
        const rawPoolEpochRewards: RawPoolEpochRewards[] = await (await getDbAsync()).query(
            queries.poolEpochRewardsQuery,
            [poolId],
        );
        const poolEpochRewards = await stakingUtils.getPoolEpochRewardsFromRaw(rawPoolEpochRewards);
        return poolEpochRewards;
    }

    public async getStakingPoolAllTimeRewardsAsync(poolId: string): Promise<AllTimePoolStats> {
        const rawAllTimePoolRewards = (await (await getDbAsync()).query(queries.allTimePoolRewardsQuery, [
            poolId,
        ])) as RawAllTimePoolRewards[];
        const rawTotalPoolProtocolFeesGenerated = (await (await getDbAsync()).query(
            queries.poolTotalProtocolFeesGeneratedQuery,
            [poolId],
        )) as RawPoolTotalProtocolFeesGenerated[];

        const rawAllTimePoolRewardsHead = _.head(rawAllTimePoolRewards);
        const rawTotalPoolProtocolFeesGeneratedHead = _.head(rawTotalPoolProtocolFeesGenerated);

        const allTimePoolRewards = stakingUtils.getAlltimePoolRewards(
            rawAllTimePoolRewardsHead,
            rawTotalPoolProtocolFeesGeneratedHead,
        );
        return allTimePoolRewards;
    }

    public async getAllTimeStakingStatsAsync(): Promise<AllTimeStakingStats> {
        const rawAllTimeStats: RawAllTimeStakingStats | undefined = _.head(
            await (await getDbAsync()).query(queries.allTimeStatsQuery),
        );
        if (!rawAllTimeStats) {
            throw new Error('Could not find allTime staking statistics.');
        }
        const allTimeAllTimeStats: AllTimeStakingStats = stakingUtils.getAllTimeStakingStatsFromRaw(rawAllTimeStats);
        return allTimeAllTimeStats;
    }

    public async getStakingPoolWithStatsAsync(poolId: string): Promise<PoolWithStats> {
        const pool = await this.getStakingPoolAsync(poolId);
        const rawCurrentEpochPoolStats = await (await getDbAsync()).query(queries.currentEpochPoolStatsQuery, [poolId]);
        const rawNextEpochPoolStats = await (await getDbAsync()).query(queries.nextEpochPoolStatsQuery, [poolId]);
        const rawPoolSevenDayProtocolFeesGenerated = await (await getDbAsync()).query(
            queries.poolSevenDayProtocolFeesGeneratedQuery,
            [poolId],
        );
        const rawAvgReward = await (await getDbAsync()).query(queries.poolAvgRewardsQuery, [poolId]);

        const currentEpochPoolStats = stakingUtils.getEpochPoolStatsFromRaw(rawCurrentEpochPoolStats[0]);
        const nextEpochPoolStats = stakingUtils.getEpochPoolStatsFromRaw(rawNextEpochPoolStats[0]);
        const pool7dProtocolFeesGenerated = stakingUtils.getPoolProtocolFeesGeneratedFromRaw(
            rawPoolSevenDayProtocolFeesGenerated[0],
        );
        const poolAvgReward = stakingUtils.getPoolAvgRewardsFromRaw(rawAvgReward[0]);

        return {
            ...pool,
            sevenDayProtocolFeesGeneratedInEth: pool7dProtocolFeesGenerated.sevenDayProtocolFeesGeneratedInEth,
            avgMemberRewardInEth: poolAvgReward.avgMemberRewardInEth,
            avgTotalRewardInEth: poolAvgReward.avgTotalRewardInEth,
            avgMemberRewardEthPerZrx: poolAvgReward.avgMemberRewardEthPerZrx,
            currentEpochStats: currentEpochPoolStats,
            nextEpochStats: nextEpochPoolStats,
        };
    }

    public async getStakingPoolsWithStatsAsync(): Promise<PoolWithStats[]> {
        const pools = await this.getStakingPoolsAsync();
        const rawCurrentEpochPoolStats = await (await getDbAsync()).query(queries.currentEpochPoolsStatsQuery);
        const rawNextEpochPoolStats = await (await getDbAsync()).query(queries.nextEpochPoolsStatsQuery);
        const rawPoolSevenDayProtocolFeesGenerated = await (await getDbAsync()).query(
            queries.sevenDayProtocolFeesGeneratedQuery,
        );
        const rawPoolsAvgRewards = await (await getDbAsync()).query(queries.poolsAvgRewardsQuery);
        const rawAllTimePoolStakedAmounts = await (await getDbAsync()).query(queries.allTimePoolStakedAmountsQuery);

        const allTimePoolStakedAmounts = await stakingUtils.getAllTimePoolStakedAmountsFromRaw(
            rawAllTimePoolStakedAmounts,
        );
        const currentEpochPoolStats = stakingUtils.getEpochPoolsStatsFromRaw(rawCurrentEpochPoolStats);
        const nextEpochPoolStats = stakingUtils.getEpochPoolsStatsFromRaw(rawNextEpochPoolStats);
        const poolProtocolFeesGenerated = stakingUtils.getPoolsProtocolFeesGeneratedFromRaw(
            rawPoolSevenDayProtocolFeesGenerated,
        );
        const poolAvgRewards = stakingUtils.getPoolsAvgRewardsFromRaw(rawPoolsAvgRewards);

        const currentEpochPoolStatsMap = arrayToMapWithId(currentEpochPoolStats, 'poolId');
        const nextEpochPoolStatsMap = arrayToMapWithId(nextEpochPoolStats, 'poolId');
        const poolProtocolFeesGeneratedMap = arrayToMapWithId(poolProtocolFeesGenerated, 'poolId');
        const poolAvgRewardsMap = arrayToMapWithId(poolAvgRewards, 'poolId');

        return pools.map(pool => ({
            ...pool,
            sevenDayProtocolFeesGeneratedInEth:
                poolProtocolFeesGeneratedMap[pool.poolId].sevenDayProtocolFeesGeneratedInEth,
            avgMemberRewardInEth: poolAvgRewardsMap[pool.poolId].avgMemberRewardInEth,
            avgTotalRewardInEth: poolAvgRewardsMap[pool.poolId].avgTotalRewardInEth,
            avgMemberRewardEthPerZrx: poolAvgRewardsMap[pool.poolId].avgMemberRewardEthPerZrx,
            currentEpochStats: currentEpochPoolStatsMap[pool.poolId],
            nextEpochStats: nextEpochPoolStatsMap[pool.poolId],
            allTimeStakedAmounts: allTimePoolStakedAmounts[pool.poolId],
        }));
    }

    public async getDelegatorCurrentEpochAsync(delegatorAddress: string): Promise<EpochDelegatorStats> {
        const rawDelegatorDeposited = (await (await getDbAsync()).query(queries.currentEpochDelegatorDepositedQuery, [
            delegatorAddress,
        ])) as RawDelegatorDeposited[];
        const rawDelegatorStaked = (await (await getDbAsync()).query(queries.currentEpochDelegatorStakedQuery, [
            delegatorAddress,
        ])) as RawDelegatorStaked[];

        const zrxDeposited = stakingUtils.getZrxStakedFromRawDelegatorDeposited(rawDelegatorDeposited);
        const { zrxStaked, poolData } = stakingUtils.getDelegatorStakedFromRaw(rawDelegatorStaked);

        return {
            zrxDeposited,
            zrxStaked,
            poolData,
        };
    }

    public async getDelegatorNextEpochAsync(delegatorAddress: string): Promise<EpochDelegatorStats> {
        const rawDelegatorDeposited = (await (await getDbAsync()).query(queries.nextEpochDelegatorDepositedQuery, [
            delegatorAddress,
        ])) as RawDelegatorDeposited[];
        const rawDelegatorStaked = (await (await getDbAsync()).query(queries.nextEpochDelegatorStakedQuery, [
            delegatorAddress,
        ])) as RawDelegatorStaked[];

        const zrxDeposited = stakingUtils.getZrxStakedFromRawDelegatorDeposited(rawDelegatorDeposited);
        const { zrxStaked, poolData } = stakingUtils.getDelegatorStakedFromRaw(rawDelegatorStaked);

        return {
            zrxDeposited,
            zrxStaked,
            poolData,
        };
    }

    public async getDelegatorEventsAsync(delegatorAddress: string): Promise<DelegatorEvent[]> {
        const rawDelegatorEvents: RawDelegatorEvent[] = await (await getDbAsync()).query(queries.delegatorEventsQuery, [
            delegatorAddress,
        ]);

        const delegatorEvents = stakingUtils.getDelegatorEventsFromRaw(rawDelegatorEvents);

        return delegatorEvents;
    }

    public async getDelegatorAllTimeStatsAsync(delegatorAddress: string): Promise<AllTimeDelegatorStats> {
        const rawDelegatorAllTimeStats = await (await getDbAsync()).query(queries.allTimeDelegatorStatsQuery, [
            delegatorAddress,
        ]);
        const poolData = stakingUtils.getDelegatorAllTimeStatsFromRaw(rawDelegatorAllTimeStats);

        return {
            poolData,
        };
    }
}

export const stakingUtils = {
    getEpochFromRaw: (rawEpoch: RawEpoch): Epoch => {
        const {
            epoch_id,
            starting_transaction_hash,
            starting_block_number,
            starting_block_timestamp,
            ending_transaction_hash,
            ending_block_number,
            ending_block_timestamp,
            zrx_deposited,
            zrx_staked,
        } = rawEpoch;
        let epochEnd: TransactionDate | undefined;
        if (ending_transaction_hash && ending_block_number) {
            epochEnd = {
                blockNumber: parseInt(ending_block_number, 10),
                txHash: ending_transaction_hash,
                timestamp: ending_block_timestamp || undefined,
            };
        }
        return {
            epochId: parseInt(epoch_id, 10),
            epochStart: {
                blockNumber: parseInt(starting_block_number, 10),
                txHash: starting_transaction_hash,
                timestamp: starting_block_timestamp || undefined,
            },
            epochEnd,
            zrxDeposited: Number(zrx_deposited || 0),
            zrxStaked: Number(zrx_staked || 0),
        };
    },
    getEpochWithFeesFromRaw: (rawEpochWithFees: RawEpochWithFees): EpochWithFees => {
        const {
            epoch_id,
            starting_transaction_hash,
            starting_block_number,
            starting_block_timestamp,
            ending_transaction_hash,
            ending_block_number,
            ending_block_timestamp,
            zrx_deposited,
            zrx_staked,
            protocol_fees_generated_in_eth,
        } = rawEpochWithFees;
        let epochEnd: TransactionDate | undefined;
        if (ending_transaction_hash && ending_block_number) {
            epochEnd = {
                blockNumber: parseInt(ending_block_number, 10),
                txHash: ending_transaction_hash,
                timestamp: ending_block_timestamp || undefined,
            };
        }
        return {
            epochId: parseInt(epoch_id, 10),
            epochStart: {
                blockNumber: parseInt(starting_block_number, 10),
                txHash: starting_transaction_hash,
                timestamp: starting_block_timestamp || undefined,
            },
            epochEnd,
            zrxDeposited: Number(zrx_deposited || 0),
            zrxStaked: Number(zrx_staked || 0),
            protocolFeesGeneratedInEth: Number(protocol_fees_generated_in_eth || 0),
        };
    },
    getPoolFromRaw: (rawPool: RawPool): Pool => {
        const {
            pool_id,
            operator,
            created_at_block_number,
            created_at_transaction_hash,
            isVerified,
            logo_url,
            location,
            bio,
            website,
            name,
        } = rawPool;
        return {
            poolId: pool_id,
            operatorAddress: operator,
            createdAt: {
                blockNumber: parseInt(created_at_block_number, 10),
                txHash: created_at_transaction_hash,
            },
            metaData: {
                name: name || undefined,
                bio: bio || undefined,
                location: location || undefined,
                isVerified: !!isVerified,
                logoUrl: logo_url || undefined,
                websiteUrl: website || undefined,
            },
        };
    },
    getPoolsFromRaw: (rawPools: RawPool[]): Pool[] => {
        return rawPools.map(stakingUtils.getPoolFromRaw);
    },
    getEpochPoolStatsFromRaw: (rawEpochPoolStats: RawEpochPoolStats): EpochPoolStats => {
        const {
            pool_id,
            maker_addresses,
            operator_share,
            zrx_staked,
            operator_zrx_staked,
            member_zrx_staked,
            share_of_stake,
            total_protocol_fees_generated_in_eth,
            share_of_fees,
            number_of_fills,
            share_of_fills,
            approximate_stake_ratio,
        } = rawEpochPoolStats;
        return {
            poolId: pool_id,
            zrxStaked: Number(zrx_staked || 0),
            operatorZrxStaked: Number(operator_zrx_staked || 0),
            memberZrxStaked: Number(member_zrx_staked || 0),
            shareOfStake: Number(share_of_stake),
            operatorShare: _.isNil(operator_share) ? undefined : Number(operator_share),
            approximateStakeRatio: approximate_stake_ratio ? Number(approximate_stake_ratio) : 0,
            makerAddresses: maker_addresses || [],
            totalProtocolFeesGeneratedInEth: Number(total_protocol_fees_generated_in_eth || 0),
            shareOfFees: Number(share_of_fees || 0),
            numberOfFills: Number(number_of_fills || 0),
            shareOfFills: Number(share_of_fills || 0),
        };
    },
    getEpochPoolsStatsFromRaw: (rawEpochPoolsStats: RawEpochPoolStats[]): EpochPoolStats[] => {
        return rawEpochPoolsStats.map(stakingUtils.getEpochPoolStatsFromRaw);
    },

    // todo: clean this up w/ types, pull out filter func
    getPoolAPYForEpoch: (
        epochReward: RawPoolEpochRewards | RawAllTimePoolStakedAmount,
        ethPrices: OHLCVData[],
        zrxPrices: OHLCVData[],
    ) => {
        const { ending_timestamp, starting_block_timestamp } = epochReward;

        const epochEndTime = new Date(ending_timestamp).getTime();
        const epochStartTime = new Date(starting_block_timestamp).getTime();
        const membersRewardsPaidInEth = Number(epochReward.members_reward || 0);
        const memberZrxStaked = Number(epochReward.member_zrx_staked || 0);

        if (!membersRewardsPaidInEth || !memberZrxStaked) {
            return 0;
        }

        const ethPricesForEpoch = ethPrices.filter((priceData: any) => {
            const a = Number(priceData.end_time) <= new Date(epochEndTime).getTime();
            const b = Number(priceData.start_time) >= new Date(epochStartTime).getTime();
            return a && b;
        });
        const zrxPricesForEpoch = zrxPrices.filter((priceData: any) => {
            const a = Number(priceData.end_time) <= new Date(epochEndTime).getTime();
            const b = Number(priceData.start_time) >= new Date(epochStartTime).getTime();
            return a && b;
        });

        const ethPriceAtEpoch = ethPricesForEpoch[ethPricesForEpoch.length - 1].close;
        const zrxPriceAtEpoch = zrxPricesForEpoch[0].close;

        const apy =
            ((membersRewardsPaidInEth * ethPriceAtEpoch) / (memberZrxStaked * zrxPriceAtEpoch)) * (365 / 7) || 0;

        return apy;
    },
    getPoolEpochRewardsFromRaw: async (rawPoolEpochRewards: RawPoolEpochRewards[]): Promise<PoolEpochRewards[]> => {
        const sortedRawPoolEpochRewards = rawPoolEpochRewards.sort(
            (a, b) => Number(a.ending_timestamp) - Number(b.ending_timestamp),
        );

        const firstPriceNeeded = sortedRawPoolEpochRewards[0].ending_timestamp;
        const lastPriceNeeded = sortedRawPoolEpochRewards[sortedRawPoolEpochRewards.length - 1].ending_timestamp;

        const zrxPrices: OHLCVData[] = await (await getDbAsync()).query(queries.usdPriceForSymbol, [
            'USD',
            'ZRX',
            new Date(firstPriceNeeded).getTime(),
            new Date(lastPriceNeeded).getTime(),
        ]);

        const ethPrices: OHLCVData[] = await (await getDbAsync()).query(queries.usdPriceForSymbol, [
            'USD',
            'ETH',
            new Date(firstPriceNeeded).getTime(),
            new Date(lastPriceNeeded).getTime(),
        ]);

        return sortedRawPoolEpochRewards.map(epochReward => {
            const apy = stakingUtils.getPoolAPYForEpoch(epochReward, ethPrices, zrxPrices);
            return {
                apy,
                epochId: Number(epochReward.epoch_id),
                epochStartTimestamp: epochReward.starting_block_timestamp,
                epochEndTimestamp: epochReward.ending_timestamp,
                operatorRewardsPaidInEth: Number(epochReward.operator_reward || 0),
                membersRewardsPaidInEth: Number(epochReward.members_reward || 0),
                memberZrxStaked: Number(epochReward.member_zrx_staked || 0),
                totalRewardsPaidInEth: Number(epochReward.total_reward || 0),
            };
        });
    },
    getPoolProtocolFeesGeneratedFromRaw: (
        rawPoolProtocolFeesGenerated: RawPoolProtocolFeesGenerated,
    ): PoolProtocolFeesGenerated => {
        const {
            pool_id,
            seven_day_protocol_fees_generated_in_eth,
            seven_day_number_of_fills,
        } = rawPoolProtocolFeesGenerated;
        return {
            poolId: pool_id,
            sevenDayProtocolFeesGeneratedInEth: Number(seven_day_protocol_fees_generated_in_eth || 0),
            sevenDayNumberOfFills: Number(seven_day_number_of_fills || 0),
        };
    },
    getPoolsProtocolFeesGeneratedFromRaw: (
        rawPoolsProtocolFeesGenerated: RawPoolProtocolFeesGenerated[],
    ): PoolProtocolFeesGenerated[] => {
        return rawPoolsProtocolFeesGenerated.map(stakingUtils.getPoolProtocolFeesGeneratedFromRaw);
    },
    getPoolAvgRewardsFromRaw: (rawPoolAvgRewards: RawPoolAvgRewards): PoolAvgRewards => {
        const {
            pool_id,
            avg_member_reward_in_eth,
            avg_total_reward_in_eth,
            avg_member_reward_eth_per_zrx,
        } = rawPoolAvgRewards;
        return {
            poolId: pool_id,
            avgMemberRewardInEth: Number(avg_member_reward_in_eth || 0),
            avgTotalRewardInEth: Number(avg_total_reward_in_eth || 0),
            avgMemberRewardEthPerZrx: Number(avg_member_reward_eth_per_zrx || 0),
        };
    },
    getPoolsAvgRewardsFromRaw: (rawPoolsAvgRewards: RawPoolAvgRewards[]): PoolAvgRewards[] => {
        return rawPoolsAvgRewards.map(stakingUtils.getPoolAvgRewardsFromRaw);
    },
    getZrxStakedFromRawDelegatorDeposited: (rawDelegatorDeposited: RawDelegatorDeposited[]): number => {
        const resultRow: RawDelegatorDeposited | undefined = _.head(rawDelegatorDeposited);
        return resultRow ? parseFloat(resultRow.zrx_deposited) : 0;
    },
    getDelegatorStakedFromRaw: (rawDelegatorStaked: RawDelegatorStaked[]) => {
        const firstRow = _.head(rawDelegatorStaked);
        const zrxStaked = (firstRow && parseFloat(firstRow.zrx_staked_overall)) || 0;

        const poolData: PoolEpochDelegatorStats[] = rawDelegatorStaked.map(row => ({
            poolId: row.pool_id,
            zrxStaked: parseFloat(row.zrx_staked_in_pool) || 0,
        }));

        return {
            zrxStaked,
            poolData,
        };
    },
    getDelegatorAllTimeStatsFromRaw: (
        rawDelegatorAllTimeStats: RawAllTimeDelegatorPoolsStats[],
    ): AllTimeDelegatorPoolStats[] => {
        const poolData: AllTimeDelegatorPoolStats[] = rawDelegatorAllTimeStats.map(rawStats => ({
            poolId: rawStats.pool_id,
            rewardsInEth: parseFloat(rawStats.reward) || 0,
        }));

        return poolData;
    },
    getDelegatorEventsFromRaw: (rawDelegatorEvents: RawDelegatorEvent[]): DelegatorEvent[] => {
        const delegatorEvents: DelegatorEvent[] = rawDelegatorEvents.map(rawEvent => ({
            eventType: rawEvent.event_type,
            address: rawEvent.address,
            blockNumber: rawEvent.block_number === null ? null : Number(rawEvent.block_number),
            eventTimestamp: rawEvent.event_timestamp,
            transactionHash: rawEvent.transaction_hash,
            eventArgs: rawEvent.event_args,
        }));

        return delegatorEvents;
    },
    getAlltimePoolRewards: (
        rawAllTimePoolRewards?: RawAllTimePoolRewards,
        rawPoolsProtocolFeesGenerated?: RawPoolTotalProtocolFeesGenerated,
    ): AllTimePoolStats => {
        return {
            operatorRewardsPaidInEth: Number(_.get(rawAllTimePoolRewards, 'operator_reward', 0)),
            membersRewardsPaidInEth: Number(_.get(rawAllTimePoolRewards, 'members_reward', 0)),
            totalRewardsPaidInEth: Number(_.get(rawAllTimePoolRewards, 'total_rewards', 0)),
            protocolFeesGeneratedInEth: Number(_.get(rawPoolsProtocolFeesGenerated, 'total_protocol_fees', 0)),
            numberOfFills: Number(_.get(rawPoolsProtocolFeesGenerated, 'number_of_fills', 0)),
        };
    },
    getAllTimeStakingStatsFromRaw: (rawAllTimeAllTimeStats: RawAllTimeStakingStats): AllTimeStakingStats => {
        const { total_rewards_paid } = rawAllTimeAllTimeStats;
        return {
            totalRewardsPaidInEth: Number(total_rewards_paid || 0),
        };
    },
    getETHZRXPriceData: () => {},
    getAllTimePoolStakedAmountsFromRaw: async (
        rawAllTimePoolStakedAmounts: RawAllTimePoolStakedAmount[],
    ): Promise<AllTimePoolStakedAmounts> => {
        const allTimePoolStakedAmounts: AllTimePoolStakedAmounts = {};

        const sortedDataByTime = rawAllTimePoolStakedAmounts.sort(
            (a, b) => Number(a.ending_timestamp) - Number(b.ending_timestamp),
        );

        const firstPriceNeeded = sortedDataByTime[0].ending_timestamp;
        const lastPriceNeeded = sortedDataByTime[sortedDataByTime.length - 1].ending_timestamp;

        const zrxPrices: OHLCVData[] = await (await getDbAsync()).query(queries.usdPriceForSymbol, [
            'USD',
            'ZRX',
            new Date(firstPriceNeeded).getTime(),
            new Date(lastPriceNeeded).getTime(),
        ]);

        const ethPrices: OHLCVData[] = await (await getDbAsync()).query(queries.usdPriceForSymbol, [
            'USD',
            'ETH',
            new Date(firstPriceNeeded).getTime(),
            new Date(lastPriceNeeded).getTime(),
        ]);

        rawAllTimePoolStakedAmounts.forEach(poolStakedAmountForEpoch => {
            const poolId = poolStakedAmountForEpoch.pool_id;

            const apy = stakingUtils.getPoolAPYForEpoch(poolStakedAmountForEpoch, ethPrices, zrxPrices);

            const poolStakedAmountForEpochData = {
                epochId: Number(poolStakedAmountForEpoch.epoch_id),
                memberZrxStaked: Number(poolStakedAmountForEpoch.member_zrx_staked || 0),
                membersReward: Number(poolStakedAmountForEpoch.members_reward || 0),
                apy,
            };
            if (allTimePoolStakedAmounts[poolId]) {
                allTimePoolStakedAmounts[poolId].push(poolStakedAmountForEpochData);
            } else {
                allTimePoolStakedAmounts[poolId] = [poolStakedAmountForEpochData];
            }
        });

        return allTimePoolStakedAmounts;
    },
};
