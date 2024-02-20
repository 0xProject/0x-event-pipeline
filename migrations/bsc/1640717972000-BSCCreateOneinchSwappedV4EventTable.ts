import { MigrationInterface, QueryRunner } from 'typeorm';

const createTable = ` create table events_bsc.oneinch_swapped_v4_events
(
    observed_timestamp bigint not null,
    contract_address varchar not null,
    transaction_hash varchar not null,
    transaction_index bigint not null,
    log_index bigint not null,
    block_hash varchar not null,
    block_number bigint not null,
    from_token varchar not null,
    to_token varchar not null,
    from_token_amount numeric not null,
    to_token_amount numeric not null,
    "from" varchar not null,
    "to" varchar,
    primary key (transaction_hash, log_index)
);`;
const createIndexes = `
create index oneinch_swapped_v4_events_transaction_transaction_hash_index
    on events_bsc.oneinch_swapped_v4_events (transaction_hash);

create index oneinch_swapped_v4_events_transaction_block_number_index
    on events_bsc.oneinch_swapped_v4_events (block_number);
`;

const addToCompetitors = `
CREATE OR REPLACE VIEW events_bsc.competitor_swaps AS
SELECT '1inch'::text AS competitor,
  oneinch_swapped_v3_events.observed_timestamp,
  oneinch_swapped_v3_events.contract_address,
  oneinch_swapped_v3_events.transaction_hash,
  oneinch_swapped_v3_events.transaction_index,
  oneinch_swapped_v3_events.log_index,
  oneinch_swapped_v3_events.block_hash,
  oneinch_swapped_v3_events.block_number,
  oneinch_swapped_v3_events.from_token,
  oneinch_swapped_v3_events.to_token,
  oneinch_swapped_v3_events.from_token_amount,
  oneinch_swapped_v3_events.to_token_amount,
  oneinch_swapped_v3_events."from",
  oneinch_swapped_v3_events."to"
FROM events_bsc.oneinch_swapped_v3_events
UNION ALL
SELECT '1inch'::text AS competitor,
  oneinch_swapped_v4_events.observed_timestamp,
  oneinch_swapped_v4_events.contract_address,
  oneinch_swapped_v4_events.transaction_hash,
  oneinch_swapped_v4_events.transaction_index,
  oneinch_swapped_v4_events.log_index,
  oneinch_swapped_v4_events.block_hash,
  oneinch_swapped_v4_events.block_number,
  oneinch_swapped_v4_events.from_token,
  oneinch_swapped_v4_events.to_token,
  oneinch_swapped_v4_events.from_token_amount,
  oneinch_swapped_v4_events.to_token_amount,
  oneinch_swapped_v4_events."from",
  oneinch_swapped_v4_events."to"
FROM events_bsc.oneinch_swapped_v4_events
UNION ALL
SELECT 'Paraswap'::text AS competitor,
  paraswap_swapped_v4_events.observed_timestamp,
  paraswap_swapped_v4_events.contract_address,
  paraswap_swapped_v4_events.transaction_hash,
  paraswap_swapped_v4_events.transaction_index,
  paraswap_swapped_v4_events.log_index,
  paraswap_swapped_v4_events.block_hash,
  paraswap_swapped_v4_events.block_number,
  paraswap_swapped_v4_events.from_token,
  paraswap_swapped_v4_events.to_token,
  paraswap_swapped_v4_events.from_token_amount,
  paraswap_swapped_v4_events.to_token_amount,
  paraswap_swapped_v4_events."from",
  paraswap_swapped_v4_events."to"
FROM events_bsc.paraswap_swapped_v4_events
UNION ALL
SELECT 'Paraswap'::text AS competitor,
  paraswap_swapped_v5_events.observed_timestamp,
  paraswap_swapped_v5_events.contract_address,
  paraswap_swapped_v5_events.transaction_hash,
  paraswap_swapped_v5_events.transaction_index,
  paraswap_swapped_v5_events.log_index,
  paraswap_swapped_v5_events.block_hash,
  paraswap_swapped_v5_events.block_number,
  paraswap_swapped_v5_events.from_token,
  paraswap_swapped_v5_events.to_token,
  paraswap_swapped_v5_events.from_token_amount,
  paraswap_swapped_v5_events.to_token_amount,
  paraswap_swapped_v5_events."from",
  paraswap_swapped_v5_events."to"
FROM events_bsc.paraswap_swapped_v5_events;
`;
const dropTable = `DROP TABLE events_bsc.oneinch_swapped_v4_events;`;

const dropIndexes = `
    DROP INDEX events_bsc.oneinch_swapped_v4_events_transaction_transaction_hash_index;
    DROP INDEX events_bsc.oneinch_swapped_v4_events_transaction_block_number_index;
    DROP INDEX events_bsc.oneinch_swapped_v4_events_transaction_contract_addres_index;
`;

export class BSCCreateOneinchSwappedV4EventTable1640717972000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
        await queryRunner.query(addToCompetitors);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropIndexes);
        await queryRunner.query(dropTable);
    }
}
