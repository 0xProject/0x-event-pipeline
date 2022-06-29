import { MigrationInterface, QueryRunner } from 'typeorm';
const createTable = ` create table events_polygon.log_transfer_events
(
    observed_timestamp bigint not null,
    contract_address text not null,
    transaction_hash text not null,
    transaction_index bigint not null,
    log_index bigint not null,
    block_hash text not null,
    block_number bigint not null,
    token text not null,
    "from" text not null,
    "to" text not null,
    amount numeric not null,
    input1 numeric not null,
    input2 numeric not null,
    output1 numeric not null,
    output2 numeric not null,
    primary key (transaction_hash, log_index)
);`;
const createIndexes = `
create index log_transfer_events_transaction_block_number_index
    on events_polygon.log_transfer_events (block_number);
`;

const dropTable = `DROP TABLE events_polygon.log_transfer_events;`;

export class PolygonCreateLogTransferEventTable1653498151000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
        await queryRunner.query(createIndexes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropTable);
    }
}
