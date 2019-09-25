import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const eventsStakeEventsTable = new Table({
    name: 'events.stake_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'owner', type: 'varchar', isPrimary: true },
        { name: 'amount_staked', type: 'bigint' },
    ],
});

const eventsUnstakeEventsTable = new Table({
    name: 'events.unstake_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'owner', type: 'varchar' },
        { name: 'amount_unstaked', type: 'bigint' },
    ],
});

const eventsMoveStakeEventsTable = new Table({
    name: 'events.move_stake_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'amount_moved', type: 'bigint' },
        { name: 'from_status', type: 'int' },
        { name: 'from_pool', type: 'varchar' },
        { name: 'to_status', type: 'int' },
        { name: 'to_pool', type: 'int' },
    ],
});

const eventsStakingPoolCreatedEventsTable = new Table({
    name: 'events.staking_pool_created_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'operator_address', type: 'varchar' },
        { name: 'operator_share', type: 'bigint' },
    ],
});

const eventsPendingAddMakerToPoolEventsTable = new Table({
    name: 'events.pending_add_maker_to_pool_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'maker_address', type: 'varchar' },
    ],
});

const eventsMakerAddedToStakingPoolEventsTable = new Table({
    name: 'events.maker_added_to_staking_pool_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'maker_address', type: 'varchar' },
    ],
});

const eventsMakerRemovedFromStakingPoolEventsTable = new Table({
    name: 'events.maker_removed_from_staking_pool_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'maker_address', type: 'varchar' },
    ],
});

const eventsStakingParamsChangedEventsTable = new Table({
    name: 'events.staking_params_changed_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'epoch_duration_in_seconds', type: 'bigint' },
        { name: 'reward_delegated_stake_weight', type: 'bigint' },
        { name: 'minimum_pool_stake', type: 'bigint' },
        { name: 'maximum_makers_in_pool', type: 'bigint' },
        { name: 'cobb_douglas_alpa_numerator', type: 'bigint' },
        { name: 'weth_proxy_address', type: 'varchar' },
        { name: 'eth_vault_address', type: 'varchar' },
        { name: 'reward_vault_address', type: 'varchar' },
        { name: 'zrx_vault_address', type: 'varchar' },
    ],
});

const eventsOperatorShareDecreasedEventsTable = new Table({
    name: 'events.operator_share_decreased_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
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
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'epoch_id', type: 'bigint' },
        { name: 'num_active_pools', type: 'bigint' },
        { name: 'rewards_available', type: 'bigint' },
        { name: 'total_weighted_stake', type: 'bigint' },
        { name: 'total_fees_collected', type: 'bigint' },
    ],
});

const eventsEpochFinalizedEventsTable = new Table({
    name: 'events.epoch_finalized_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'epoch_id', type: 'bigint' },
        { name: 'rewards_paid', type: 'bigint' },
        { name: 'rewards_remaining', type: 'bigint' },
    ],
});

const eventsRewardsPaidEventsTable = new Table({
    name: 'events.rewards_paid_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'epoch_id', type: 'bigint' },
        { name: 'pool_id', type: 'varchar' },
        { name: 'operator_reward', type: 'bigint' },
        { name: 'members_reward', type: 'bigint' },
    ],
});

const eventsFillEventsTable = new Table({
    name: 'events.fill_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'maker_address', type: 'varchar' },
        { name: 'taker_address', type: 'varchar' },
        { name: 'fee_recipient_address', type: 'varchar' },
        { name: 'maker_asset_filled_amount', type: 'bigint' },
        { name: 'taker_asset_filled_amount', type: 'bigint' },
        { name: 'order_hash', type: 'varchar' },
        { name: 'raw_maker_asset_data', type: 'varchar' },
        { name: 'maker_token_address', type: 'varchar' },
        { name: 'maker_asset_type', type: 'varchar' },
        { name: 'maker_asset_proxy_id', type: 'varchar' },
        { name: 'raw_taker_asset_data', type: 'varchar' },
        { name: 'taker_token_address', type: 'varchar' },
        { name: 'taker_asset_type', type: 'varchar' },
        { name: 'taker_asset_proxy_id', type: 'varchar' },
        { name: 'protocol_fee_paid', type: 'bigint' },
    ],
});

const eventsTransactionsTable = new Table({
    name: 'events.transactions',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'block_hash', type: 'varchar', isPrimary: true },
        { name: 'block_number', type: 'bigint' },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'sender', type: 'varchar' },
        { name: 'to_address', type: 'varchar' },
        { name: 'gas_price', type: 'bigint' },
        { name: 'gas_used', type: 'bigint' },
        { name: 'input', type: 'varchar' },
    ],
});

const eventsBlocksTable = new Table({
    name: 'events.blocks',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'block_timestamp', type: 'bigint' },
    ],
});

const eventsLastBlockProcessedTable = new Table({
    name: 'events.last_block_process',
    columns: [
        { name: 'event_name', type: 'varchar' },
        { name: 'last_processed_block_number', type: 'bigint' },
        { name: 'last_processed_block_hash', type: 'varchar' },
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
        { name: 'start_time', type: 'timestamptz' },
        { name: 'starting_block_number', type: 'bigint' },
        { name: 'starting_transaction_hash', type: 'varchar' },
        { name: 'starting_transaction_index', type: 'bigint' },
        { name: 'total_fees_collected', type: 'numeric' },
        { name: 'total_zrx_staked', type: 'numeric' },
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
        await queryRunner.createTable(eventsPendingAddMakerToPoolEventsTable);
        await queryRunner.createTable(eventsMakerAddedToStakingPoolEventsTable);
        await queryRunner.createTable(eventsMakerRemovedFromStakingPoolEventsTable);
        await queryRunner.createTable(eventsStakingParamsChangedEventsTable);
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
        await queryRunner.createTable(stakingDownstreamTablesLastUpdatedTable);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(eventsStakeEventsTable);
        await queryRunner.dropTable(eventsUnstakeEventsTable);
        await queryRunner.dropTable(eventsMoveStakeEventsTable);
        await queryRunner.dropTable(eventsStakingPoolCreatedEventsTable);
        await queryRunner.dropTable(eventsPendingAddMakerToPoolEventsTable);
        await queryRunner.dropTable(eventsMakerAddedToStakingPoolEventsTable);
        await queryRunner.dropTable(eventsMakerRemovedFromStakingPoolEventsTable);
        await queryRunner.dropTable(eventsStakingParamsChangedEventsTable);
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
        await queryRunner.dropTable(stakingDownstreamTablesLastUpdatedTable);

        await queryRunner.dropSchema('events');
        await queryRunner.dropSchema('staking');
    }

}
