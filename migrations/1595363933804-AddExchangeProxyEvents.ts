import { MigrationInterface, QueryRunner, Table } from "typeorm";

const eventsTransformedERC20EventsTable = new Table({
    name: 'events.transformed_erc20_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'taker', type: 'varchar' },
        { name: 'input_token', type: 'varchar' },
        { name: 'output_token', type: 'varchar' },
        { name: 'input_token_amount', type: 'numeric' },
        { name: 'output_token_amount', type: 'numeric' },
    ],
});

const createTransformedERC20IndexQuery = `
    CREATE INDEX transformed_erc20_transaction_hash_index
    ON events.transformed_erc20_events (transaction_hash);

    CREATE INDEX transformed_erc20_block_number_index
    ON events.transformed_erc20_events (block_number);

    CREATE INDEX transformed_erc20_taker_index
    ON events.transformed_erc20_events (taker);
`;

const dropTransformedERC20IndexQuery = `
    DROP INDEX events.transformed_erc20_transaction_hash_index;
    DROP INDEX events.transformed_erc20_block_number_index;
    DROP INDEX events.transformed_erc20_taker_index;
`;

export class AddExchangeProxyEvents1595363933804 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(eventsTransformedERC20EventsTable);
        await queryRunner.query(createTransformedERC20IndexQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropTransformedERC20IndexQuery);
        await queryRunner.dropTable(eventsTransformedERC20EventsTable);
    }

}
