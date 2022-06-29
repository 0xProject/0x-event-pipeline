import { MigrationInterface, QueryRunner } from 'typeorm';
const createTable = ` create table events_polygon.slingshot_trade_events
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
create index slingshot_trade_events_transaction_transaction_hash_index
    on events_polygon.slingshot_trade_events (transaction_hash);

create index slingshot_trade_events_transaction_block_number_index
    on events_polygon.slingshot_trade_events (block_number);

create index slingshot_trade_events_transaction_contract_addres_index
    on events_polygon.slingshot_trade_events (contract_address);
`;
const dropTable = `DROP TABLE events_polygon.slingshot_trade_events;`;

const dropIndexes = `
    DROP INDEX events_polygon.slingshot_trade_events_transaction_transaction_hash_index;
    DROP INDEX events_polygon.slingshot_trade_events_transaction_block_number_index;
    DROP INDEX events_polygon.slingshot_trade_events_transaction_contract_addres_index;
`;

export class PolygonCreateSlingshotTradeEventTable1622222283468 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropIndexes);
        await queryRunner.query(dropTable);
    }
}
