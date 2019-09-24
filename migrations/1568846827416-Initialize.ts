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

const eventsMakerAddedToStakingPoolEvents = new Table({
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

const eventsMakerRemovedFromStakingPoolEvents = new Table({
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

const eventsStakingParamsChangedEvents = new Table({
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

const eventsOperatorShareDecreasedEvents = new Table({
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

const eventsEpochEndedEvents = new Table({
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

const eventsEpochFinalizedEvents = new Table({
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

const eventsRewardsPaidEvents = new Table({
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

const eventsFillEvents = new Table({
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

const eventsLastBlockProcessed = new Table({
    name: 'events.last_block_process',
    columns: [
        { name: 'event_name', type: 'varchar' },
        { name: 'last_processed_block_number', type: 'bigint' },
        { name: 'last_processed_block_hash', type: 'varchar' },
        { name: 'processed_timestamp', type: 'bigint' },
    ],
});

const stakingStakingPoolMetadata = new Table({
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

const stakingCurrentEpochInfo = new Table({
    name: 'staking.current_epoch_info',
    columns: [
        { name: 'epoch_id', type: 'bigint' },
        { name: 'start_time', type: 'timestamptz' },
        { name: 'starting_block', type: 'bigint' },
        { name: 'starting_transaction_hash', type: 'varchar' },
        { name: 'total_fees_collected', type: 'numeric' },
        { name: 'total_zrx_staked', type: 'numeric' },
    ],
});

const stakingEpochs = new Table({
    name: 'staking.epochs',
    columns: [
        { name: 'epoch_id', type: 'bigint' },
        { name: 'start_time', type: 'timestamptz' },
        { name: 'end_time', type: 'timestamptz' },
        { name: 'starting_block_number', type: 'bigint' },
        { name: 'ending_block_number', type: 'bigint' },
        { name: 'starting_transaction_hash', type: 'varchar' },
        { name: 'ending_transaction_hash', type: 'varchar' },
        { name: 'starting_transaction_index', type: 'bigint' },
        { name: 'ending_transaction_index', type: 'bigint' },
        { name: 'total_fees_collected', type: 'numeric' },
    ],
});

const stakingZrxStakingChanges = new Table({
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

const stakingCurrentEpochPoolInfo = new Table({
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

const stakingEpochStartPoolStatus = new Table({
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

const stakingHistoricPoolEpochInfo = new Table({
    name: 'staking.historic_pool_epoch_info',
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
        await queryRunner.createTable(eventsMakerAddedToStakingPoolEvents);
        await queryRunner.createTable(eventsMakerRemovedFromStakingPoolEvents);
        await queryRunner.createTable(eventsStakingParamsChangedEvents);
        await queryRunner.createTable(eventsOperatorShareDecreasedEvents);
        await queryRunner.createTable(eventsEpochEndedEvents);
        await queryRunner.createTable(eventsEpochFinalizedEvents);
        await queryRunner.createTable(eventsRewardsPaidEvents);
        await queryRunner.createTable(eventsLastBlockProcessed);
        await queryRunner.createTable(stakingStakingPoolMetadata);
        await queryRunner.createTable(stakingCurrentEpochInfo);
        await queryRunner.createTable(stakingEpochs);
        await queryRunner.createTable(stakingZrxStakingChanges);
        await queryRunner.createTable(stakingCurrentEpochPoolInfo);
        await queryRunner.createTable(stakingEpochStartPoolStatus);
        await queryRunner.createTable(stakingHistoricPoolEpochInfo);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(eventsStakeEventsTable);
        await queryRunner.dropTable(eventsUnstakeEventsTable);
        await queryRunner.dropTable(eventsMoveStakeEventsTable);
        await queryRunner.dropTable(eventsStakingPoolCreatedEventsTable);
        await queryRunner.dropTable(eventsPendingAddMakerToPoolEventsTable);
        await queryRunner.dropTable(eventsMakerAddedToStakingPoolEvents);
        await queryRunner.dropTable(eventsMakerRemovedFromStakingPoolEvents);
        await queryRunner.dropTable(eventsStakingParamsChangedEvents);
        await queryRunner.dropTable(eventsOperatorShareDecreasedEvents);
        await queryRunner.dropTable(eventsEpochEndedEvents);
        await queryRunner.dropTable(eventsEpochFinalizedEvents);
        await queryRunner.dropTable(eventsRewardsPaidEvents);
        await queryRunner.dropTable(eventsLastBlockProcessed);
        await queryRunner.dropTable(stakingStakingPoolMetadata);
        await queryRunner.dropTable(stakingCurrentEpochInfo);
        await queryRunner.dropTable(stakingEpochs);
        await queryRunner.dropTable(stakingZrxStakingChanges);
        await queryRunner.dropTable(stakingCurrentEpochPoolInfo);
        await queryRunner.dropTable(stakingEpochStartPoolStatus);
        await queryRunner.dropTable(stakingHistoricPoolEpochInfo);

        await queryRunner.dropSchema('events');
        await queryRunner.dropSchema('staking');
    }

}
