import { MigrationInterface, QueryRunner } from 'typeorm';

const createTable = `
CREATE TABLE events_arbitrum.erc1155_order_cancelled_events
(
    observed_timestamp bigint NOT NULL,
    contract_address varchar NOT NULL,
    transaction_hash varchar NOT NULL,
    transaction_index bigint NOT NULL,
    log_index bigint NOT NULL,
    block_hash varchar NOT NULL,
    block_number bigint NOT NULL,
    order_hash varchar NOT NULL,
    maker varchar NOT NULL,
    PRIMARY KEY (transaction_hash, log_index)
);`;

const createIndexes = `
CREATE INDEX erc1155_order_cancelled_events_block_number_idx ON events_arbitrum.erc1155_order_cancelled_events (block_number);
CREATE INDEX erc1155_order_cancelled_events_maker_idx ON events_arbitrum.erc1155_order_cancelled_events (maker);
`;

const dropTable = `DROP TABLE events_arbitrum.erc1155_order_cancelled_event;`;

const dropIndexes = `
DROP INDEX events_arbitrum.erc1155_order_cancelled_events_block_number_idx;
DROP INDEX events_arbitrum.erc1155_order_cancelled_events_maker_idx;
`;

export class CreateErc1155OrderCancelledEventTableArbitrum1662138316100 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropIndexes);
        await queryRunner.query(dropTable);
    }
}
