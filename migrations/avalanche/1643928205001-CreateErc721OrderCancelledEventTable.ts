import { MigrationInterface, QueryRunner } from 'typeorm';
const createTable = ` create table events_avalanche.erc721_order_cancelled_events
(
    observed_timestamp bigint not null,
    contract_address varchar not null,
    transaction_hash varchar not null,
    transaction_index bigint not null,
    log_index bigint not null,
    block_hash varchar not null,
    block_number bigint not null,
    maker varchar not null,
    nonce numeric not null,
    primary key (transaction_hash, log_index)
);`;

const createIndexes = `
CREATE INDEX erc721_order_cancelled_events_block_number_idx ON events_avalanche.erc721_order_cancelled_events (block_number);
CREATE INDEX erc721_order_cancelled_events_maker_idx ON events_avalanche.erc721_order_cancelled_events (maker);
`;

const dropTable = `DROP TABLE events_avalanche.erc721_order_cancelled_event;`;

const dropIndexes = `
DROP INDEX events_avalanche.erc721_order_cancelled_events_block_number_idx;
DROP INDEX events_avalanche.erc721_order_cancelled_events_maker_idx;
`;

export class CreateErc721OrderCancelledEventTable1643928205001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropIndexes);
        await queryRunner.query(dropTable);
    }
}
