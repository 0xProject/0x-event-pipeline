import { MigrationInterface, QueryRunner, Table } from "typeorm";

const eventsTransactionExecutionEvents = new Table({
    name: 'events.transaction_execution_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'zeroex_transaction_hash', type: 'varchar' },
    ],
});

const createIndexQuery = `
    CREATE INDEX transaction_execution_events_transaction_hash_index
    ON events.transaction_execution_events (transaction_hash);

    CREATE INDEX transaction_execution_events_block_number_index
    ON events.transaction_execution_events (block_number);

    CREATE INDEX transaction_execution_events_0x_tx_index
    ON events.transaction_execution_events (zeroex_transaction_hash);
`;

const dropIndexQuery = `
    DROP INDEX events.transaction_execution_events_transaction_hash_index;
    DROP INDEX events.transaction_execution_events_block_number_index;
    DROP INDEX events.transaction_execution_events_0x_tx_index;
`;

const changeQuoteIdToVarchar = `
    ALTER TABLE events.transactions
    ALTER COLUMN quote_id TYPE VARCHAR;
`;

const revertChangeQuoteIdToVarchar = `
    ALTER TABLE events.transactions
    ALTER COLUMN quote_id TYPE BIGINT USING quote_id::BIGINT;
`;


export class AddTransactionExecutionEvents1597875723415 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(eventsTransactionExecutionEvents);
        await queryRunner.query(createIndexQuery);
        await queryRunner.query(changeQuoteIdToVarchar);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropIndexQuery);
        await queryRunner.dropTable(eventsTransactionExecutionEvents);
        await queryRunner.query(revertChangeQuoteIdToVarchar);
    }

}
