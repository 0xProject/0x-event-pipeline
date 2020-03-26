import { MigrationInterface, QueryRunner } from "typeorm";

const createEventIndexes = `
    CREATE INDEX fill_events_block_number_index
    ON events.fill_events (block_number);

    CREATE INDEX fill_events_block_position_index
    ON events.fill_events (block_number, transaction_index);

    CREATE INDEX fill_events_transaction_hash_index
    ON events.fill_events (transaction_hash);

    CREATE INDEX epoch_ended_events_block_number_index
    ON events.epoch_ended_events (block_number);

    CREATE INDEX epoch_finalized_events_block_number_index
    ON events.epoch_finalized_events (block_number);

    CREATE INDEX maker_staking_pool_set_events_events_block_number_index
    ON events.maker_staking_pool_set_events (block_number);

    CREATE INDEX move_stake_events_block_number_index
    ON events.move_stake_events (block_number);

    CREATE INDEX operator_share_decreased_events_block_number_index
    ON events.operator_share_decreased_events (block_number);

    CREATE INDEX params_set_events_block_number_index
    ON events.params_set_events (block_number);

    CREATE INDEX rewards_paid_events_block_number_index
    ON events.rewards_paid_events (block_number);

    CREATE INDEX stake_events_block_number_index
    ON events.stake_events (block_number);

    CREATE INDEX staking_pool_created_events_block_number_index
    ON events.staking_pool_created_events (block_number);

    CREATE INDEX unstake_events_block_number_index
    ON events.unstake_events (block_number);

    CREATE INDEX blocks_block_timestamp_index
    ON events.blocks (TO_TIMESTAMP(block_timestamp));
`;

const dropEventIndexes = `
    DROP INDEX events.fill_events_block_number_index;
    DROP INDEX events.fill_events_block_position_index;
    DROP INDEX events.fill_events_transaction_hash_index;
    DROP INDEX events.epoch_ended_events_block_number_index;
    DROP INDEX events.epoch_finalized_events_block_number_index;
    DROP INDEX events.maker_staking_pool_set_events_events_block_number_index;
    DROP INDEX events.move_stake_events_block_number_index;
    DROP INDEX events.operator_share_decreased_events_block_number_index;
    DROP INDEX events.params_set_events_block_number_index;
    DROP INDEX events.rewards_paid_events_block_number_index;
    DROP INDEX events.stake_events_block_number_index;
    DROP INDEX events.staking_pool_created_events_block_number_index;
    DROP INDEX events.unstake_events_block_number_index;
    DROP INDEX events.blocks_block_timestamp_index;
`;

export class AddIndexing1585243869780 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(createEventIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropEventIndexes);
    }

}
