import {MigrationInterface, QueryRunner, Table} from "typeorm";

const eventsTransactionsTableOld = new Table({
    name: 'events.transactions',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'sender_address', type: 'varchar' },
        { name: 'to_address', type: 'varchar' },
        { name: 'gas_price', type: 'numeric' },
        { name: 'gas_used', type: 'numeric' },
        { name: 'input', type: 'varchar' },
    ],
});

const eventsTransactionsTable = new Table({
    name: 'events.transactions',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true},
        { name: 'nonce', type: 'bigint' },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'sender_address', type: 'varchar' },
        { name: 'to_address', type: 'varchar', isNullable: true },
        { name: 'value', type: 'numeric' },
        { name: 'gas_price', type: 'numeric' },
        { name: 'gas', type: 'numeric' },
        { name: 'input', type: 'varchar' },
        { name: 'affiliate_address', type: 'varchar', isNullable:  true },
        { name: 'quote_timestamp', type: 'bigint', isNullable: true },
        { name: 'quote_id', type: 'bigint', isNullable: true },
    ],
});

const createIndex = `
    CREATE INDEX transactions_block_number_index
    ON events.transactions (block_number);
`;

const dropIndex = `
    DROP INDEX events.transactions_block_number_index;
`;

export class AddTransactionsTable1594091234858 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(eventsTransactionsTableOld);
        await queryRunner.createTable(eventsTransactionsTable);
        await queryRunner.query(createIndex);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropIndex);
        await queryRunner.dropTable(eventsTransactionsTable);
        await queryRunner.createTable(eventsTransactionsTableOld);
    }

}
