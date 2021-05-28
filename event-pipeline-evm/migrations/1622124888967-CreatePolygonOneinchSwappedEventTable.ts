import { MigrationInterface, QueryRunner } from 'typeorm';
const createTable = ` create table events_polygon.oneinch_swapped_events
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
    constraint "PK_0e29a12f959d1552d589f49c66c"
        primary key (transaction_hash, log_index)
);`;
const createIndexes = `
create index oneinch_swapped_events_transaction_transaction_hash_index
    on events_polygon.oneinch_swapped_events (transaction_hash);

create index oneinch_swapped_events_transaction_block_number_index
    on events_polygon.oneinch_swapped_events (block_number);

create index oneinch_swapped_events_transaction_contract_addres_index
    on events_polygon.oneinch_swapped_events (contract_address);
`;
const dropTable = `DROP TABLE events_polygon.oneinch_swapped_events;`;

const dropIndexes = `
    DROP INDEX events_polygon.oneinch_swapped_events_transaction_transaction_hash_index;
    DROP INDEX events_polygon.oneinch_swapped_events_transaction_block_number_index;
    DROP INDEX events_polygon.oneinch_swapped_events_transaction_contract_addres_index;
`;

export class CreatePolygonOneinchSwappedEventTable1622124888967 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropIndexes);
        await queryRunner.query(dropTable);
    }
}
