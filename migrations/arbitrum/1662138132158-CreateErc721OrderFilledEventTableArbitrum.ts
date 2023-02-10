import { MigrationInterface, QueryRunner } from 'typeorm';

const createTable = `
CREATE TABLE events_arbitrum.erc721_order_filled_events
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
    nonce numeric NOT NULL,
    erc20_token varchar NOT NULL,
    erc20_token_amount numeric NOT NULL,
    erc721_token varchar NOT NULL,
    erc721_token_id numeric NOT NULL,
    matcher varchar NULL,
    PRIMARY KEY (transaction_hash, log_index)
);`;

const createIndexes = `
CREATE INDEX erc721_order_filled_events_block_number_idx ON events_arbitrum.erc721_order_filled_events (block_number);
CREATE INDEX erc721_order_filled_events_maker_idx ON events_arbitrum.erc721_order_filled_events (maker);
CREATE INDEX erc721_order_filled_events_taker_idx ON events_arbitrum.erc721_order_filled_events (taker);
CREATE INDEX erc721_order_filled_events_erc20_token_idx ON events_arbitrum.erc721_order_filled_events (erc20_token);
CREATE INDEX erc721_order_filled_events_erc721_token_id_idx ON events_arbitrum.erc721_order_filled_events (erc721_token_id);
CREATE INDEX erc721_order_filled_events_matcher_idx ON events_arbitrum.erc721_order_filled_events (matcher);
`;

const dropTable = `DROP TABLE events_arbitrum.erc721_order_filled_event;`;

const dropIndexes = `
DROP INDEX events_arbitrum.erc721_order_filled_events_block_number_idx;
DROP INDEX events_arbitrum.erc721_order_filled_events_erc20_token_idx;
DROP INDEX events_arbitrum.erc721_order_filled_events_erc721_token_id_idx;
DROP INDEX events_arbitrum.erc721_order_filled_events_maker_idx;
DROP INDEX events_arbitrum.erc721_order_filled_events_taker_idx;
DROP INDEX events_arbitrum.erc721_order_filled_events_matcher_idx;
`;

export class CreateErc721OrderFilledEventTableArbitrum1662138132158 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropIndexes);
        await queryRunner.query(dropTable);
    }
}
