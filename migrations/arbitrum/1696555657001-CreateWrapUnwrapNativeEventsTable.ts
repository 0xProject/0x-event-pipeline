import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const wrapNativeEvent = new Table({
    name: 'events_arbitrum.wrap_native_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'dst', type: 'varchar' },
        { name: 'wad', type: 'numeric' },
    ],
});

const createWrapNativeEventIndexQuery = `
    CREATE INDEX wrap_native_events_transaction_hash_index
    ON events_arbitrum.wrap_native_events (transaction_hash);

    CREATE INDEX wrap_native_events_block_number_index
    ON events_arbitrum.wrap_native_events (block_number);
`;

const dropWrapNativeEventIndexQuery = `
    DROP INDEX events_arbitrum.wrap_native_events_transaction_hash_index;
    DROP INDEX events_arbitrum.wrap_native_events_block_number_index;
`;

const unwrapNativeEvent = new Table({
    name: 'events_arbitrum.unwrap_native_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'src', type: 'varchar' },
        { name: 'wad', type: 'numeric' },
    ],
});

const createUnwrapNativeEventIndexQuery = `
  CREATE INDEX unwrap_native_events_transaction_hash_index
  ON events_arbitrum.unwrap_native_events (transaction_hash);

  CREATE INDEX unwrap_native_events_block_number_index
  ON events_arbitrum.unwrap_native_events (block_number);
`;

const dropUnwrapNativeEventIndexQuery = `
  DROP INDEX events_arbitrum.unwrap_native_events_transaction_hash_index;
  DROP INDEX events_arbitrum.unwrap_native_events_block_number_index;
`;

export class CreateWrapUnwrapNativeEventsTable1696555657001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(wrapNativeEvent);
        await queryRunner.query(createWrapNativeEventIndexQuery);
        await queryRunner.createTable(unwrapNativeEvent);
        await queryRunner.query(createUnwrapNativeEventIndexQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropWrapNativeEventIndexQuery);
        await queryRunner.dropTable(wrapNativeEvent);
        await queryRunner.query(dropUnwrapNativeEventIndexQuery);
        await queryRunner.dropTable(unwrapNativeEvent);
    }
}
