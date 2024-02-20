import { MigrationInterface, QueryRunner } from 'typeorm';

const createTable = ` create table events_bsc.paraswap_swapped_events
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
    referrer varchar,
    primary key (transaction_hash, log_index)
);`;
const createIndexes = `
create index paraswap_swapped_events_transaction_transaction_hash_index
    on events_bsc.paraswap_swapped_events (transaction_hash);

create index paraswap_swapped_events_transaction_block_number_index
    on events_bsc.paraswap_swapped_events (block_number);

create index paraswap_swapped_events_transaction_contract_addres_index
    on events_bsc.paraswap_swapped_events (contract_address);
`;
const dropTable = `DROP TABLE events_bsc.paraswap_swapped_events;`;

const dropIndexes = `
    DROP INDEX events_bsc.paraswap_swapped_events_transaction_transaction_hash_index;
    DROP INDEX events_bsc.paraswap_swapped_events_transaction_block_number_index;
    DROP INDEX events_bsc.paraswap_swapped_events_transaction_contract_addres_index;
`;

export class BSCCreateParaswapSwappedEventTable1623878571095 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropIndexes);
        await queryRunner.query(dropTable);
    }
}
