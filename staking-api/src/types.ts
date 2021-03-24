export interface ObjectMap<T> {
    [key: string]: T;
}
export interface RawEpoch {
    epoch_id: string;
    starting_transaction_hash: string;
    starting_block_number: string;
    starting_transaction_index?: string;
    starting_block_timestamp?: string;
    ending_transaction_hash?: null;
    ending_transaction_index?: null;
    ending_block_number?: null;
    ending_block_timestamp?: null;
    zrx_deposited?: string;
    zrx_staked?: string;
}

// Separating out the response with fees
// As this is a significantly heavier query (it has to sum over fills)
export interface RawEpochWithFees extends RawEpoch {
    protocol_fees_generated_in_eth: string;
}

export interface TransactionDate {
    blockNumber: number;
    txHash: string;
    timestamp?: string;
}

export interface Epoch {
    epochId: number;
    epochStart: TransactionDate;
    epochEnd?: TransactionDate;
    zrxStaked: number;
    zrxDeposited: number;
}

export interface EpochWithFees extends Epoch {
    protocolFeesGeneratedInEth: number;
}

export interface RawPool {
    pool_id: string;
    operator: string;
    created_at_block_number: string;
    created_at_transaction_hash: string;
    created_at_transaction_index: string;
    maker_addresses: string[];
    isVerified?: boolean;
    logo_url?: string;
    location?: string;
    bio?: string;
    website?: string;
    name?: string;
}

export interface RawPoolEpochRewards {
    epoch_id: string;
    pool_id: string;
    operator_reward: string;
    members_reward: string;
    total_reward: string;
    // Fields below are available but not used in response
    starting_block_timestamp: string;
    starting_block_number: string;
    starting_transaction_index: string;
    ending_block_number: string;
    ending_timestamp: string;
    ending_transaction_hash: string;
}

export interface PoolMetadata {
    isVerified: boolean;
    logoUrl?: string;
    location?: string;
    bio?: string;
    websiteUrl?: string;
    name?: string;
}

export interface Pool {
    poolId: string;
    operatorAddress: string;
    createdAt: TransactionDate;
    metaData: PoolMetadata;
}

export interface PoolWithStats extends Pool {
    currentEpochStats: EpochPoolStats;
    nextEpochStats: EpochPoolStats;
    sevenDayProtocolFeesGeneratedInEth: number;
    avgMemberRewardInEth: number;
    avgTotalRewardInEth: number;
    avgMemberRewardEthPerZrx: number;
}

export interface PoolWithHistoricalStats extends PoolWithStats {
    allTimeStats: AllTimePoolStats;
    epochRewards: PoolEpochRewards[];
}

export interface RawEpochPoolStats {
    pool_id: string;
    maker_addresses: string[];
    operator_share?: string;
    zrx_staked?: string;
    operator_zrx_staked?: string;
    member_zrx_staked?: string;
    total_staked?: string;
    share_of_stake?: string;
    total_protocol_fees_generated_in_eth?: string;
    number_of_fills?: string;
    share_of_fees?: string;
    share_of_fills?: string;
    approximate_stake_ratio?: string;
}

export interface EpochPoolStats {
    poolId: string;
    zrxStaked: number;
    operatorZrxStaked: number;
    memberZrxStaked: number;
    shareOfStake: number;
    operatorShare?: number;
    makerAddresses: string[];
    totalProtocolFeesGeneratedInEth: number;
    shareOfFees: number;
    numberOfFills: number;
    shareOfFills: number;
    approximateStakeRatio: number;
}

export interface RewardsStats {
    operatorRewardsPaidInEth: number;
    membersRewardsPaidInEth: number;
    totalRewardsPaidInEth: number;
}

export interface PoolEpochRewards extends RewardsStats {
    epochId: number;
    epochStartTimestamp: string;
    epochEndTimestamp: string;
}

export interface RawPoolProtocolFeesGenerated {
    pool_id: string;
    seven_day_protocol_fees_generated_in_eth: string;
    seven_day_number_of_fills: string;
}

export interface RawPoolAvgRewards {
    pool_id: string;
    avg_member_reward_in_eth: string;
    avg_total_reward_in_eth: string;
    avg_member_stake: string;
    avg_member_reward_eth_per_zrx: string;
}

export interface PoolAvgRewards {
    poolId: string;
    avgMemberRewardInEth: number;
    avgTotalRewardInEth: number;
    avgMemberRewardEthPerZrx: number;
}

export interface RawPoolTotalProtocolFeesGenerated {
    pool_id: string;
    total_protocol_fees: string;
    number_of_fills: string;
}

export interface PoolProtocolFeesGenerated {
    poolId: string;
    sevenDayProtocolFeesGeneratedInEth: number;
    sevenDayNumberOfFills: number;
}

export interface RawAllTimeStakingStats {
    total_rewards_paid: string;
}
export interface AllTimeStakingStats {
    totalRewardsPaidInEth: number;
}

export interface StakingPoolResponse {
    poolId: string;
    stakingPool: PoolWithHistoricalStats;
}
export interface StakingPoolsResponse {
    stakingPools: PoolWithStats[];
}

export interface RawDelegatorDeposited {
    delegator: string;
    zrx_deposited: string;
}

export interface RawDelegatorStaked {
    delegator: string;
    zrx_staked_overall: string;
    pool_id: string;
    zrx_staked_in_pool: string;
}

export interface RawAllTimeDelegatorPoolsStats {
    pool_id: string;
    reward: string;
}

export interface RawAllTimePoolRewards {
    pool_id: string;
    operator_reward: string;
    members_reward: string;
    total_rewards: string;
}

export interface PoolEpochDelegatorStats {
    poolId: string;
    zrxStaked: number;
}

export interface EpochDelegatorStats {
    zrxDeposited: number;
    zrxStaked: number;
    poolData: PoolEpochDelegatorStats[];
}

export interface AllTimePoolStats extends RewardsStats {
    protocolFeesGeneratedInEth: number;
    numberOfFills: number;
}

export interface AllTimeDelegatorPoolStats {
    poolId: string;
    rewardsInEth: number;
}

export interface AllTimeDelegatorStats {
    poolData: AllTimeDelegatorPoolStats[];
}

export interface StakingDelegatorResponse {
    delegatorAddress: string;
    forCurrentEpoch: EpochDelegatorStats;
    forNextEpoch: EpochDelegatorStats;
    allTime: AllTimeDelegatorStats;
}
export interface StakingEpochsResponse {
    currentEpoch: Epoch;
    nextEpoch: Epoch;
}
export interface StakingEpochsWithFeesResponse {
    currentEpoch: EpochWithFees;
    nextEpoch: EpochWithFees;
}
export interface StakingStatsResponse {
    allTime: AllTimeStakingStats;
}

export interface RawDelegatorEvent {
    event_type: string;
    address: string;
    block_number: string | null;
    event_timestamp: string;
    transaction_hash: string | null;
    event_args: object;
}
export interface DelegatorEvent {
    eventType: string;
    address: string;
    blockNumber: number | null;
    eventTimestamp: string;
    transactionHash: string | null;
    eventArgs: object;
}
