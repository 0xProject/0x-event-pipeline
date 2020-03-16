import { MigrationInterface, QueryRunner, Table } from "typeorm";

const eventsERC20BridgeTransferEventsTable = new Table({
    name: 'events.erc20_bridge_transfer_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'from_token', type: 'varchar' },
        { name: 'to_token', type: 'varchar' },
        { name: 'from_token_amount', type: 'numeric' },
        { name: 'to_token_amount', type: 'numeric' },
        { name: 'from', type: 'varchar' },
        { name: 'to', type: 'varchar' },
    ],
});

const createBridgeTradesIndexQuery = `
    CREATE INDEX bridge_trades_transaction_hash_index
    ON events.erc20_bridge_transfer_events (transaction_hash);

    CREATE INDEX bridge_trades_block_number_index
    ON events.erc20_bridge_transfer_events (block_number);

    CREATE INDEX bridge_trades_contract_address_index
    ON events.erc20_bridge_transfer_events (contract_address);
`;

const dropBridgeTradesIndexQuery = `
    DROP INDEX events.bridge_trades_transaction_hash_index;
    DROP INDEX events.bridge_trades_block_number_index;
    DROP INDEX events.bridge_trades_contract_address_index;
`;

export class AddERC20BridgeTrades1584383937873 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(eventsERC20BridgeTransferEventsTable);
        await queryRunner.query(createBridgeTradesIndexQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropBridgeTradesIndexQuery);
        await queryRunner.dropTable(eventsERC20BridgeTransferEventsTable);
    }

}
