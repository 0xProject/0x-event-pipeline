import {MigrationInterface, QueryRunner} from "typeorm";

const createTable = `
CREATE TABLE events_arbitrum.erc721_order_presigned_events
(
    observed_timestamp bigint NOT NULL,
    contract_address varchar NOT NULL,
    transaction_hash varchar NOT NULL,
    transaction_index bigint NOT NULL,
    log_index bigint NOT NULL,
    block_hash varchar NOT NULL,
    block_number bigint NOT NULL,
    is_sell boolean NOT NULL,
    maker varchar NOT NULL,
    taker varchar NOT NULL,
    expiry numeric NOT NULL,
    nonce numeric NOT NULL,
    erc20_token varchar NOT NULL,
    erc20_token_amount numeric NOT NULL,
    fees varchar NULL,
    erc721_token varchar NOT NULL,
    erc721_token_id numeric NULL,
    erc721_token_properties varchar NULL,
    PRIMARY KEY (transaction_hash, log_index)
);`;

const createIndexes = `
CREATE INDEX erc721_order_presigned_events_block_number_idx ON events_arbitrum.erc721_order_presigned_events (block_number);
CREATE INDEX erc721_order_presigned_events_maker_idx ON events_arbitrum.erc721_order_presigned_events (maker);
CREATE INDEX erc721_order_presigned_events_taker_idx ON events_arbitrum.erc721_order_presigned_events (taker);
CREATE INDEX erc721_order_presigned_events_erc20_token_idx ON events_arbitrum.erc721_order_presigned_events (erc20_token);
CREATE INDEX erc721_order_presigned_events_erc721_token_id_idx ON events_arbitrum.erc721_order_presigned_events (erc721_token_id);
`;

const dropTable = `DROP TABLE events_arbitrum.erc721_order_presigned_event;`;

const dropIndexes = `
DROP INDEX events_arbitrum.erc721_order_presigned_events_block_number_idx;
DROP INDEX events_arbitrum.erc721_order_presigned_events_erc20_token_idx;
DROP INDEX events_arbitrum.erc721_order_presigned_events_erc721_token_id_idx;
DROP INDEX events_arbitrum.erc721_order_presigned_events_maker_idx;
DROP INDEX events_arbitrum.erc721_order_presigned_events_taker_idx;
`;

export class CreateErc721OrderPresignedEventTableArbitrum1662138221358 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropIndexes);
        await queryRunner.query(dropTable);
    }

}
