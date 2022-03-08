import { MigrationInterface, QueryRunner } from 'typeorm';
const createTable = ` create table events.erc721_order_presigned_events
(
    observed_timestamp bigint not null,
    contract_address varchar not null,
    transaction_hash varchar not null,
    transaction_index bigint not null,
    log_index bigint not null,
    block_hash varchar not null,
    block_number bigint not null,
    is_sell boolean not null,
    maker varchar not null,
    taker varchar not null,
    expiry numeric not null,
    nonce numeric not null,
    erc20_token varchar not null,
    erc20_token_amount numeric not null,
    fees varchar null,
    erc721_token varchar not null,
    erc721_token_id numeric null,
    erc721_token_properties varchar null,
    primary key (transaction_hash, log_index)
);`;

const createIndexes = `
CREATE INDEX erc721_order_presigned_events_block_number_idx ON events.erc721_order_presigned_events (block_number);
CREATE INDEX erc721_order_presigned_events_maker_idx ON events.erc721_order_presigned_events (maker);
CREATE INDEX erc721_order_presigned_events_taker_idx ON events.erc721_order_presigned_events (taker);
CREATE INDEX erc721_order_presigned_events_erc20_token_idx ON events.erc721_order_presigned_events (erc20_token);
CREATE INDEX erc721_order_presigned_events_erc721_token_id_idx ON events.erc721_order_presigned_events (erc721_token_id);
`;

const dropTable = `DROP TABLE events.erc721_order_presigned_event;`;

const dropIndexes = `
DROP INDEX events.erc721_order_presigned_events_block_number_idx;
DROP INDEX events.erc721_order_presigned_events_erc20_token_idx;
DROP INDEX events.erc721_order_presigned_events_erc721_token_id_idx;
DROP INDEX events.erc721_order_presigned_events_maker_idx;
DROP INDEX events.erc721_order_presigned_events_taker_idx;
`;

export class CreateErc721OrderPresignedEventTable1643928205002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropIndexes);
        await queryRunner.query(dropTable);
    }
}
