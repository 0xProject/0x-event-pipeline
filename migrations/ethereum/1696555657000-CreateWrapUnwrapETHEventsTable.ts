import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const wrapETHEvent = new Table({
    name: 'events.wrap_eth_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'sender_address', type: 'varchar' },
        { name: 'amount', type: 'bigint' },
    ],
});

const createWrapETHEventIndexQuery = `
    CREATE INDEX wrap_eth_events_transaction_hash_index
    ON events.wrap_eth_events (transaction_hash);

    CREATE INDEX wrap_eth_events_block_number_index
    ON events.wrap_eth_events (block_number);
`;

const dropWrapETHEventIndexQuery = `
    DROP INDEX events.wrap_eth_events_transaction_hash_index;
    DROP INDEX events.wrap_eth_events_block_number_index;
`;

const unwrapETHEvent = new Table({
    name: 'events.unwrap_eth_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'receiver_address', type: 'varchar' },
        { name: 'amount', type: 'bigint' },
    ],
});

const createUnwrapETHEventIndexQuery = `
  CREATE INDEX unwrap_eth_events_transaction_hash_index
  ON events.unwrap_eth_events (transaction_hash);

  CREATE INDEX unwrap_eth_events_block_number_index
  ON events.unwrap_eth_events (block_number);
`;

const dropUnwrapETHEventIndexQuery = `
  DROP INDEX events.unwrap_eth_events_transaction_hash_index;
  DROP INDEX events.unwrap_eth_events_block_number_index;
`;

export class CreateWrapUnwrapETHEventsTable1696555657000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(wrapETHEvent);
        await queryRunner.query(createWrapETHEventIndexQuery);
        await queryRunner.createTable(unwrapETHEvent);
        await queryRunner.query(createUnwrapETHEventIndexQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropWrapETHEventIndexQuery);
        await queryRunner.dropTable(wrapETHEvent);
        await queryRunner.query(dropUnwrapETHEventIndexQuery);
        await queryRunner.dropTable(unwrapETHEvent);
    }
}
