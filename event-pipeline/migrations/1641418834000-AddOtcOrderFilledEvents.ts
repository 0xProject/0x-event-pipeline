import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const eventsOtcOrderFilledEvents = new Table({
    name: 'events.otc_order_filled_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },

        { name: 'order_hash', type: 'varchar' },
        { name: 'maker_address', type: 'varchar' },
        { name: 'taker_address', type: 'varchar' },
        { name: 'maker_token_address', type: 'varchar' },
        { name: 'taker_token_address', type: 'varchar' },
        { name: 'maker_token_filled_amount', type: 'numeric' },
        { name: 'taker_token_filled_amount', type: 'numeric' },
    ],
});

const indexQuery = `
    CREATE INDEX otc_order_filled_events_transaction_hash_index
        ON events.otc_order_filled_events (transaction_hash);
    CREATE INDEX otc_order_filled_events_block_number_index
        ON events.otc_order_filled_events (block_number);
    CREATE INDEX otc_order_filled_events_maker_address_index
        ON events.otc_order_filled_events (maker_address);
    CREATE INDEX otc_order_filled_events_order_hash_index
        ON events.otc_order_filled_events (order_hash);

`;

const dropIndexQuery = `
    DROP INDEX events.otc_order_filled_events_transaction_hash_index;
    DROP INDEX events.otc_order_filled_events_block_number_index;
    DROP INDEX events.otc_order_filled_events_maker_address_index;
    DROP INDEX events.otc_order_filled_events_order_hash_index;
`;

export class AddOtcOrderFilledEvents1641418834000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(eventsOtcOrderFilledEvents);
        await queryRunner.query(indexQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropIndexQuery);
        await queryRunner.dropTable(eventsOtcOrderFilledEvents);
    }
}
