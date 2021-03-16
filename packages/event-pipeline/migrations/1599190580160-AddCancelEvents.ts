import { MigrationInterface, QueryRunner, Table } from "typeorm";

const eventsCancelEvents = new Table({
    name: 'events.cancel_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },

        { name: 'maker_address', type: 'char(42)' },
        { name: 'fee_recipient_address', type: 'char(42)' },
        { name: 'sender_address', type: 'char(42)' },
        { name: 'order_hash', type: 'varchar' },

        { name: 'raw_maker_asset_data', type: 'varchar' },
        { name: 'maker_proxy_type', type: 'varchar', isNullable: true },
        { name: 'maker_asset_proxy_id', type: 'varchar', isNullable: true },
        { name: 'maker_token_address', type: 'char(42)', isNullable: true },
        { name: 'raw_taker_asset_data', type: 'varchar' },
        { name: 'taker_proxy_type', type: 'varchar', isNullable: true },
        { name: 'taker_asset_proxy_id', type: 'varchar', isNullable: true },
        { name: 'taker_token_address', type: 'char(42)', isNullable: true },
    ],
});

const eventsCancelUpToEvents = new Table({
    name: 'events.cancel_up_to_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },

        { name: 'maker_address', type: 'char(42)' },
        { name: 'sender_address', type: 'char(42)' },
        { name: 'order_epoch', type: 'numeric' },
    ],
});

const indexQuery = `
    CREATE INDEX cancel_events_order_hash_index
        ON events.cancel_events (order_hash);
    CREATE INDEX cancel_events_maker_index
        ON events.cancel_events (maker_address);
    CREATE INDEX cancel_events_transaction_hash_index
        ON events.cancel_events (transaction_hash);
    CREATE INDEX cancel_events_block_number_index
        ON events.cancel_events (block_number);
    CREATE INDEX cancel_up_to_events_block_number_index
        ON events.cancel_up_to_events (block_number);
    CREATE INDEX cancel_up_to_events_transaction_hash_index
        ON events.cancel_up_to_events (transaction_hash);
    CREATE INDEX cancel_up_to_events_maker_address_index
        ON events.cancel_up_to_events (maker_address);
`;

const dropIndexQuery = `
    DROP INDEX events.cancel_events_order_hash_index;
    DROP INDEX events.cancel_events_maker_index;
    DROP INDEX events.cancel_events_transaction_hash_index;
    DROP INDEX events.cancel_events_block_number_index;
    DROP INDEX events.cancel_up_to_events_block_number_index;
    DROP INDEX events.cancel_up_to_events_transaction_hash_index;
    DROP INDEX events.cancel_up_to_events_maker_address_index;
`;

export class AddCancelEvents1599190580160 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(eventsCancelEvents);
        await queryRunner.createTable(eventsCancelUpToEvents);
        await queryRunner.query(indexQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropIndexQuery);
        await queryRunner.dropTable(eventsCancelEvents);
        await queryRunner.dropTable(eventsCancelUpToEvents);
    }

}
