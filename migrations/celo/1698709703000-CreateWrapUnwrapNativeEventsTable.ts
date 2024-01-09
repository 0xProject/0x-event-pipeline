import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// Create pseudo table in Celo for api.intrinsic_enriched_transactions pipeline
const wrapNativeEvent = new Table({
    name: 'events_celo.wrap_native_events',
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

const unwrapNativeEvent = new Table({
    name: 'events_celo.unwrap_native_events',
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

export class CreateWrapUnwrapNativeEventsTable1698709703000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(wrapNativeEvent);
        await queryRunner.createTable(unwrapNativeEvent);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(wrapNativeEvent);
        await queryRunner.dropTable(unwrapNativeEvent);
    }
}
