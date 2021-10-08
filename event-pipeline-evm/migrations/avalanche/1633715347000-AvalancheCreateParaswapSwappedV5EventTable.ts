import { MigrationInterface, QueryRunner } from 'typeorm';
const createTable = ` create table events_avalanche.paraswap_swapped_v5_events
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
    expected_amount numeric,
    uuid varchar,
    primary key (transaction_hash, log_index)
);`;
const createIndexes = `
create index paraswap_swapped_v5_events_transaction_transaction_hash_index
    on events_avalanche.paraswap_swapped_v5_events (transaction_hash);

create index paraswap_swapped_v5_events_transaction_block_number_index
    on events_avalanche.paraswap_swapped_v5_events (block_number);
`;

const addToCompetitors = `
DROP TABLE events_avalanche.competitor_swaps;
CREATE OR REPLACE VIEW events_avalanche.competitor_swaps AS (
  SELECT
    'Paraswap' AS competitor,
    observed_timestamp,
    contract_address,
    transaction_hash,
    transaction_index,
    log_index,
    block_hash,
    block_number,
    from_token,
    to_token,
    from_token_amount,
    to_token_amount,
    "from",
    "to"
  FROM events_avalanche.paraswap_swapped_v5_events
);
`;

const dropTable = `DROP TABLE events_avalanche.paraswap_swapped_v5_events;`;

const dropIndexes = `
    DROP INDEX events_avalanche.paraswap_swapped_v5_events_transaction_transaction_hash_index;
    DROP INDEX events_avalanche.paraswap_swapped_v5_events_transaction_block_number_index;
`;

export class AvalancheCreateParaswapSwappedV5EventTable1633715347000 implements MigrationInterface {
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
