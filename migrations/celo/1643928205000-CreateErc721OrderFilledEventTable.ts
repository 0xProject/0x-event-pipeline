import { MigrationInterface, QueryRunner } from 'typeorm';

const createTable = ` create table events_celo.erc721_order_filled_events
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
    nonce numeric not null,
    erc20_token varchar not null,
    erc20_token_amount numeric not null,
    erc721_token varchar not null,
    erc721_token_id numeric not null,
    matcher varchar null,
    primary key (transaction_hash, log_index)
);`;

const createIndexes = `
CREATE INDEX erc721_order_filled_events_block_number_idx ON events_celo.erc721_order_filled_events (block_number);
CREATE INDEX erc721_order_filled_events_maker_idx ON events_celo.erc721_order_filled_events (maker);
CREATE INDEX erc721_order_filled_events_taker_idx ON events_celo.erc721_order_filled_events (taker);
CREATE INDEX erc721_order_filled_events_erc20_token_idx ON events_celo.erc721_order_filled_events (erc20_token);
CREATE INDEX erc721_order_filled_events_erc721_token_id_idx ON events_celo.erc721_order_filled_events (erc721_token_id);
CREATE INDEX erc721_order_filled_events_matcher_idx ON events_celo.erc721_order_filled_events (matcher);
`;

const dropTable = `DROP TABLE events_celo.erc721_order_filled_event;`;

const dropIndexes = `
DROP INDEX events_celo.erc721_order_filled_events_block_number_idx;
DROP INDEX events_celo.erc721_order_filled_events_erc20_token_idx;
DROP INDEX events_celo.erc721_order_filled_events_erc721_token_id_idx;
DROP INDEX events_celo.erc721_order_filled_events_maker_idx;
DROP INDEX events_celo.erc721_order_filled_events_taker_idx;
DROP INDEX events_celo.erc721_order_filled_events_matcher_idx;
`;

export class CreateErc721OrderFilledEventTable1643928205000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropIndexes);
        await queryRunner.query(dropTable);
    }
}
