import {MigrationInterface, QueryRunner, Table} from "typeorm";


const eventsV4CancelEvents = new Table({
    name: 'events.v4_cancel_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },

        { name: 'maker', type: 'varchar' },
        { name: 'order_hash', type: 'varchar' },
    ],
});

const eventsExpiredRfqOrderEvents = new Table({
    name: 'events.expired_rfq_order_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },

        { name: 'maker', type: 'varchar' },
        { name: 'order_hash', type: 'varchar' },
        { name: 'expiry', type: 'numeric' },

    ],
});


const indexQuery = `

    CREATE INDEX v4_cancel_events_transaction_hash_index
        ON events.v4_cancel_events (transaction_hash);
    CREATE INDEX v4_cancel_events_block_number_index
        ON events.v4_cancel_events (block_number);
    CREATE INDEX v4_cancel_events_maker_index
        ON events.v4_cancel_events (maker);
    CREATE INDEX v4_cancel_events_order_hash_index
        ON events.v4_cancel_events (order_hash);

    
    CREATE INDEX expired_rfq_events_block_number_index
        ON events.expired_rfq_order_events (block_number);
    CREATE INDEX expired_rfq_events_transaction_hash_index
        ON events.expired_rfq_order_events (transaction_hash);
    CREATE INDEX expired_rfq_events_maker_index
        ON events.expired_rfq_order_events (maker);
    CREATE INDEX expired_rfq_events_order_hash_index
        ON events.v4_cancel_events (order_hash);
`;

const dropIndexQuery = `
    DROP INDEX events.v4_cancel_events_transaction_hash_index;
    DROP INDEX events.v4_cancel_events_block_number_index;
    DROP INDEX events.v4_cancel_events_maker_index;
    DROP INDEX events.v4_cancel_events_order_hash_index;
    DROP INDEX events.expired_rfq_events_block_number_index;
    DROP INDEX events.expired_rfq_events_transaction_hash_index;
    DROP INDEX events.expired_rfq_events_maker_index;
    DROP INDEX events.expired_rfq_events_order_hash_index;
`;


export class AddV4CancelAndMultiplexEvents1615870349094 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(eventsV4CancelEvents);
        await queryRunner.createTable(eventsExpiredRfqOrderEvents);
        await queryRunner.query(indexQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropIndexQuery);
        await queryRunner.dropTable(eventsExpiredRfqOrderEvents);
        await queryRunner.dropTable(eventsV4CancelEvents);
    }
}
