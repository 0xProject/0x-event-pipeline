import {MigrationInterface, QueryRunner} from "typeorm";

const createTable = `
CREATE TABLE events_arbitrum.erc1155_order_presigned_events
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
    erc1155_token varchar NOT NULL,
    erc1155_token_id numeric NULL,
    erc1155_token_properties varchar NULL,
    erc1155_token_amount numeric NOT NULL,
    PRIMARY KEY (transaction_hash, log_index)
);`;

const createIndexes = `
CREATE INDEX erc1155_order_presigned_events_block_number_idx ON events_arbitrum.erc1155_order_presigned_events (block_number);
CREATE INDEX erc1155_order_presigned_events_maker_idx ON events_arbitrum.erc1155_order_presigned_events (maker);
CREATE INDEX erc1155_order_presigned_events_taker_idx ON events_arbitrum.erc1155_order_presigned_events (taker);
CREATE INDEX erc1155_order_presigned_events_erc20_token_idx ON events_arbitrum.erc1155_order_presigned_events (erc20_token);
CREATE INDEX erc1155_order_presigned_events_erc1155_token_id_idx ON events_arbitrum.erc1155_order_presigned_events (erc1155_token_id);
`;

const dropTable = `DROP TABLE events_arbitrum.erc1155_order_presigned_event;`;

const dropIndexes = `
DROP INDEX events_arbitrum.erc1155_order_presigned_events_block_number_idx;
DROP INDEX events_arbitrum.erc1155_order_presigned_events_erc20_token_idx;
DROP INDEX events_arbitrum.erc1155_order_presigned_events_erc1155_token_id_idx;
DROP INDEX events_arbitrum.erc1155_order_presigned_events_maker_idx;
DROP INDEX events_arbitrum.erc1155_order_presigned_events_taker_idx;
`;

export class CreateErc1155OrderPresignedEventTableArbitrum1662138334152 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropIndexes);
        await queryRunner.query(dropTable);
    }

}
