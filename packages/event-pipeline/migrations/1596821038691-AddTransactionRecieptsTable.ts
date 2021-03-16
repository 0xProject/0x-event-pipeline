import { MigrationInterface, QueryRunner, Table } from "typeorm";

const eventsTransactionReceiptsTable = new Table({
    name: 'events.transaction_receipts',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true},
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'sender_address', type: 'varchar' },
        { name: 'to_address', type: 'varchar', isNullable: true },
        { name: 'gas_used', type: 'numeric' },
    ],
});

const eventsTransactionLogsTable = new Table({
    name: 'events.transaction_logs',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true},
        { name: 'logs', type: 'varchar' },
    ],
});

const createIndex = `
    CREATE INDEX transaction_receipts_block_number_index
    ON events.transaction_receipts (block_number);
`;

const dropIndex = `
    DROP INDEX events.transaction_receipts_block_number_index;
`;

export class AddTransactionRecieptsTable1596821038691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(eventsTransactionReceiptsTable);
        await queryRunner.createTable(eventsTransactionLogsTable);
        await queryRunner.query(createIndex);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropIndex);
        await queryRunner.dropTable(eventsTransactionReceiptsTable);
        await queryRunner.dropTable(eventsTransactionLogsTable);
    }

}
