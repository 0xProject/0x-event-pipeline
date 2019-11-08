import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const eventsStakeEventsTable = new Table({
    name: 'events.stake_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'staker', type: 'varchar' },
        { name: 'amount', type: 'numeric' },
    ],
});

const eventsUnstakeEventsTable = new Table({
    name: 'events.unstake_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'staker', type: 'varchar' },
        { name: 'amount', type: 'numeric' },
    ],
});

const eventsMoveStakeEventsTable = new Table({
    name: 'events.move_stake_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'staker', type: 'varchar' },
        { name: 'amount', type: 'numeric' },
        { name: 'from_status', type: 'int' },
        { name: 'from_pool', type: 'varchar' },
        { name: 'to_status', type: 'int' },
        { name: 'to_pool', type: 'varchar' },
    ],
});

const eventsStakingPoolCreatedEventsTable = new Table({
    name: 'events.staking_pool_created_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'operator_address', type: 'varchar' },
        { name: 'operator_share', type: 'bigint' },
    ],
});

const eventsStakingPoolEarnedRewardsInEpochEventsTable = new Table({
    name: 'events.staking_pool_earned_rewards_in_epoch_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'epoch_id', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
    ],
});

const eventsMakerStakingPoolSetEventsTable = new Table({
    name: 'events.maker_staking_pool_set_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'maker_address', type: 'varchar' },
        { name: 'pool_id', type: 'varchar' },
    ],
});

const eventsParamsSetEventsTable = new Table({
    name: 'events.params_set_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'epoch_duration_in_seconds', type: 'bigint' },
        { name: 'reward_delegated_stake_weight', type: 'bigint' },
        { name: 'minimum_pool_stake', type: 'numeric' },
        { name: 'cobb_douglas_alpa_numerator', type: 'bigint' },
        { name: 'cobb_douglas_alpa_denominator', type: 'bigint' },
    ],
});

const eventsOperatorShareDecreasedEventsTable = new Table({
    name: 'events.operator_share_decreased_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'old_operator_share', type: 'bigint' },
        { name: 'new_operator_share', type: 'bigint' },
    ],
});

const eventsEpochEndedEventsTable = new Table({
    name: 'events.epoch_ended_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'epoch_id', type: 'bigint' },
        { name: 'num_pools_to_finalize', type: 'bigint' },
        { name: 'rewards_available', type: 'numeric' },
        { name: 'total_fees_collected', type: 'numeric' },
        { name: 'total_weighted_stake', type: 'numeric' },
    ],
});

const eventsEpochFinalizedEventsTable = new Table({
    name: 'events.epoch_finalized_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'epoch_id', type: 'bigint' },
        { name: 'rewards_paid', type: 'numeric' },
        { name: 'rewards_remaining', type: 'numeric' },
    ],
});

const eventsRewardsPaidEventsTable = new Table({
    name: 'events.rewards_paid_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'epoch_id', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'operator_reward', type: 'numeric' },
        { name: 'members_reward', type: 'numeric' },
    ],
});

const eventsFillEventsTable = new Table({
    name: 'events.fill_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'maker_address', type: 'varchar' },
        { name: 'taker_address', type: 'varchar' },
        { name: 'fee_recipient_address', type: 'varchar' },
        { name: 'sender_address', type: 'varchar' },
        { name: 'maker_asset_filled_amount', type: 'numeric' },
        { name: 'taker_asset_filled_amount', type: 'numeric' },
        { name: 'order_hash', type: 'varchar' },
        { name: 'raw_maker_asset_data', type: 'varchar' },
        { name: 'maker_proxy_type', type: 'varchar' },
        { name: 'maker_proxy_id', type: 'varchar' },
        { name: 'maker_token_address', type: 'varchar', isNullable: true },
        { name: 'raw_taker_asset_data', type: 'varchar' },
        { name: 'taker_proxy_type', type: 'varchar' },
        { name: 'taker_proxy_id', type: 'varchar' },
        { name: 'taker_token_address', type: 'varchar', isNullable: true },
        { name: 'maker_fee_paid', type: 'numeric' },
        { name: 'taker_fee_paid', type: 'numeric' },
        { name: 'maker_fee_proxy_type', type: 'varchar', isNullable: true },
        { name: 'maker_fee_token_address', type: 'varchar', isNullable: true },
        { name: 'taker_fee_proxy_type', type: 'varchar', isNullable: true },
        { name: 'taker_fee_token_address', type: 'varchar', isNullable: true },
        { name: 'protocol_fee_paid', type: 'numeric', isNullable: true },
    ],
});

const eventsTransactionsTable = new Table({
    name: 'events.transactions',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'sender_address', type: 'varchar' },
        { name: 'to_address', type: 'varchar' },
        { name: 'gas_price', type: 'numeric' },
        { name: 'gas_used', type: 'numeric' },
        { name: 'input', type: 'varchar' },
    ],
});

const eventsBlocksTable = new Table({
    name: 'events.blocks',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint', isPrimary: true },
        { name: 'block_timestamp', type: 'bigint' },
    ],
});

const eventsLastBlockProcessedTable = new Table({
    name: 'events.last_block_processed',
    columns: [
        { name: 'event_name', type: 'varchar', isPrimary: true },
        { name: 'last_processed_block_number', type: 'bigint' },
        { name: 'processed_timestamp', type: 'bigint' },
    ],
});

const stakingStakingPoolMetadataTable = new Table({
    name: 'staking.staking_pool_metadata',
    columns: [
        { name: 'pool_id', type: 'varchar' },
        { name: 'name', type: 'varchar' },
        { name: 'website', type: 'varchar' },
        { name: 'bio', type: 'varchar' },
        { name: 'location', type: 'varchar' },
        { name: 'logo_url', type: 'varchar' },
        { name: 'verified', type: 'boolean' },
    ],
});

const stakingCurrentEpochInfoTable = new Table({
    name: 'staking.current_epoch_info',
    columns: [
        { name: 'epoch_id', type: 'bigint' },
        { name: 'start_time', type: 'bigint' },
        { name: 'starting_block_number', type: 'bigint' },
        { name: 'starting_transaction_hash', type: 'varchar' },
        { name: 'starting_transaction_index', type: 'bigint' },
        { name: 'total_fees_collected', type: 'numeric' },
        { name: 'zrx_staked_for_next_epoch', type: 'numeric' },
        { name: 'zrx_staked', type: 'numeric' },
    ],
});

const stakingEpochsTable = new Table({
    name: 'staking.epochs',
    columns: [
        { name: 'epoch_id', type: 'bigint' },
        { name: 'start_time', type: 'timestamptz' },
        { name: 'end_time', type: 'timestamptz', isNullable: true },
        { name: 'starting_block_number', type: 'bigint' },
        { name: 'ending_block_number', type: 'bigint', isNullable: true },
        { name: 'starting_transaction_hash', type: 'varchar' },
        { name: 'ending_transaction_hash', type: 'varchar', isNullable: true },
        { name: 'starting_transaction_index', type: 'bigint' },
        { name: 'ending_transaction_index', type: 'bigint', isNullable: true },
        { name: 'zrx_staked', type: 'numeric', isNullable: true },
        { name: 'total_fees_collected', type: 'numeric', isNullable: true },
    ],
});

const stakingZrxStakingChangesTable = new Table({
    name: 'staking.zrx_staking_changes',
    columns: [
        { name: 'pool_id', type: 'varchar' },
        { name: 'amount_moved', type: 'bigint' },
        { name: 'block_number', type: 'bigint' },
        { name: 'block_timestamp', type: 'timestamptz' },
        { name: 'transaction_hash', type: 'varchar' },
        { name: 'transaction_index', type: 'bigint' },
    ],
});

const stakingCurrentEpochPoolInfoTable = new Table({
    name: 'staking.current_epoch_pool_info',
    columns: [
        { name: 'epoch_id', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'fees_generated', type: 'numeric' },
        { name: 'zrx_staked', type: 'numeric' },
        { name: 'operator_zrx_staked', type: 'numeric' },
        { name: 'market_makers', type: 'varchar[]' },
        { name: 'operator_share', type: 'numeric' },
    ],
});

const stakingEpochStartPoolStatusTable = new Table({
    name: 'staking.epoch_start_pool_status',
    columns: [
        { name: 'epoch_id', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'zrx_staked', type: 'numeric' },
        { name: 'operator_zrx_staked', type: 'numeric' },
        { name: 'market_makers', type: 'varchar[]' },
        { name: 'operator_share', type: 'numeric' },
    ],
});

const stakingHistoricalPoolEpochInfoTable = new Table({
    name: 'staking.historical_pool_epoch_info',
    columns: [
        { name: 'epoch_id', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'fees_generated', type: 'numeric' },
        { name: 'operator_reward', type: 'numeric' },
        { name: 'members_reward', type: 'numeric' },
    ],
});

const stakingDelegatorPoolEpochsTable = new Table({
    name: 'staking.delegator_pool_epochs',
    columns: [
        { name: 'delegator_address', type: 'varchar' },
        { name: 'epoch_id', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'zrx_staked', type: 'numeric' },
        { name: 'rewards_earned', type: 'numeric' },
    ],
});

const stakingDelegatorPoolCurrentEpochTable = new Table({
    name: 'staking.delegator_pool_current_epochß',
    columns: [
        { name: 'delegator_address', type: 'varchar' },
        { name: 'epoch_id', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'zrx_staked_for_next_epoch', type: 'numeric' },
    ],
});


const stakingDownstreamTablesLastUpdatedTable = new Table({
    name: 'staking.downstream_tables_last_updated',
    columns: [
        { name: 'epoch_id', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'fees_generated', type: 'numeric' },
        { name: 'operator_reward', type: 'numeric' },
        { name: 'members_reward', type: 'numeric' },
    ],
});

export class Initialize1568846827416 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createSchema('events');
        await queryRunner.createSchema('staking');

        await queryRunner.createTable(eventsStakeEventsTable);
        await queryRunner.createTable(eventsUnstakeEventsTable);
        await queryRunner.createTable(eventsMoveStakeEventsTable);
        await queryRunner.createTable(eventsStakingPoolCreatedEventsTable);
        await queryRunner.createTable(eventsStakingPoolEarnedRewardsInEpochEventsTable);
        await queryRunner.createTable(eventsMakerStakingPoolSetEventsTable);
        await queryRunner.createTable(eventsParamsSetEventsTable);
        await queryRunner.createTable(eventsOperatorShareDecreasedEventsTable);
        await queryRunner.createTable(eventsEpochEndedEventsTable);
        await queryRunner.createTable(eventsEpochFinalizedEventsTable);
        await queryRunner.createTable(eventsRewardsPaidEventsTable);
        await queryRunner.createTable(eventsFillEventsTable);
        await queryRunner.createTable(eventsTransactionsTable);
        await queryRunner.createTable(eventsBlocksTable);
        await queryRunner.createTable(eventsLastBlockProcessedTable);
        await queryRunner.createTable(stakingStakingPoolMetadataTable);
        await queryRunner.createTable(stakingCurrentEpochInfoTable);
        await queryRunner.createTable(stakingEpochsTable);
        await queryRunner.createTable(stakingZrxStakingChangesTable);
        await queryRunner.createTable(stakingCurrentEpochPoolInfoTable);
        await queryRunner.createTable(stakingEpochStartPoolStatusTable);
        await queryRunner.createTable(stakingHistoricalPoolEpochInfoTable);
        await queryRunner.createTable(stakingDelegatorPoolEpochsTable);
        await queryRunner.createTable(stakingDelegatorPoolCurrentEpochTable);
        await queryRunner.createTable(stakingDownstreamTablesLastUpdatedTable);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(eventsStakeEventsTable);
        await queryRunner.dropTable(eventsUnstakeEventsTable);
        await queryRunner.dropTable(eventsMoveStakeEventsTable);
        await queryRunner.dropTable(eventsStakingPoolCreatedEventsTable);
        await queryRunner.dropTable(eventsStakingPoolEarnedRewardsInEpochEventsTable);
        await queryRunner.dropTable(eventsMakerStakingPoolSetEventsTable);
        await queryRunner.dropTable(eventsParamsSetEventsTable);
        await queryRunner.dropTable(eventsOperatorShareDecreasedEventsTable);
        await queryRunner.dropTable(eventsEpochEndedEventsTable);
        await queryRunner.dropTable(eventsEpochFinalizedEventsTable);
        await queryRunner.dropTable(eventsRewardsPaidEventsTable);
        await queryRunner.dropTable(eventsFillEventsTable);
        await queryRunner.dropTable(eventsTransactionsTable);
        await queryRunner.dropTable(eventsBlocksTable);
        await queryRunner.dropTable(eventsLastBlockProcessedTable);
        await queryRunner.dropTable(stakingStakingPoolMetadataTable);
        await queryRunner.dropTable(stakingCurrentEpochInfoTable);
        await queryRunner.dropTable(stakingEpochsTable);
        await queryRunner.dropTable(stakingZrxStakingChangesTable);
        await queryRunner.dropTable(stakingCurrentEpochPoolInfoTable);
        await queryRunner.dropTable(stakingEpochStartPoolStatusTable);
        await queryRunner.dropTable(stakingHistoricalPoolEpochInfoTable);
        await queryRunner.dropTable(stakingDelegatorPoolEpochsTable);
        await queryRunner.dropTable(stakingDelegatorPoolCurrentEpochTable);
        await queryRunner.dropTable(stakingDownstreamTablesLastUpdatedTable);

        await queryRunner.dropSchema('events');
        await queryRunner.dropSchema('staking');
    }

}
