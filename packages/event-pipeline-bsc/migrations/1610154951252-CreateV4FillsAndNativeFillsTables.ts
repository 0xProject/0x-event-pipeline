import { MigrationInterface, QueryRunner, Table } from "typeorm";

const eventsRfqOrderFillsV4Table = new Table({
    name: 'events.v4_rfq_order_filled_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'order_hash', type: 'varchar' },
        { name: 'maker', type: 'varchar' },
        { name: 'taker', type: 'varchar' },
        { name: 'maker_token', type: 'varchar' },
        { name: 'taker_token', type: 'varchar' },
        { name: 'maker_token_filled_amount', type: 'numeric' },
        { name: 'taker_token_filled_amount', type: 'numeric' },
        { name: 'pool', type: 'varchar' },
    ],
});


const createRfqOrderFillsV4IndexQuery = `
    CREATE INDEX rfq_order_fills_v4_transaction_hash_index
    ON events.v4_rfq_order_filled_events (transaction_hash);

    CREATE INDEX rfq_order_fills_v4_block_number_index
    ON events.v4_rfq_order_filled_events (block_number);

    CREATE INDEX rfq_order_fills_v4_maker_index
    ON events.v4_rfq_order_filled_events (maker);
`;

const dropRfqOrderFillsV4IndexQuery = `
    DROP INDEX events.rfq_order_fills_v4_transaction_hash_index;
    DROP INDEX events.rfq_order_fills_v4_block_number_index;
    DROP INDEX events.rfq_order_fills_v4_maker_index;
`;


const eventsLimitOrderFillsV4Table = new Table({
    name: 'events.v4_limit_order_filled_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'order_hash', type: 'varchar' },
        { name: 'maker', type: 'varchar' },
        { name: 'taker', type: 'varchar' },
        { name: 'fee_recipient', type: 'varchar' },
        { name: 'maker_token', type: 'varchar' },
        { name: 'taker_token', type: 'varchar' },
        { name: 'maker_token_filled_amount', type: 'numeric' },
        { name: 'taker_token_filled_amount', type: 'numeric' },
        { name: 'taker_token_fee_filled_amount', type: 'numeric' },
        { name: 'protocol_fee_paid', type: 'numeric' },
        { name: 'pool', type: 'varchar' },
    ],
});


const createLimitOrderFillsV4IndexQuery = `
    CREATE INDEX limit_order_fills_v4_transaction_hash_index
    ON events.v4_limit_order_filled_events (transaction_hash);

    CREATE INDEX limit_order_fills_v4_block_number_index
    ON events.v4_limit_order_filled_events (block_number);

    CREATE INDEX limit_order_fills_v4_maker_index
    ON events.v4_limit_order_filled_events (maker);
`;

const dropLimitOrderFillsV4IndexQuery = `
    DROP INDEX events.limit_order_fills_v4_transaction_hash_index;
    DROP INDEX events.limit_order_fills_v4_block_number_index;
    DROP INDEX events.limit_order_fills_v4_maker_index;
`;

const eventsNativeFillTable = new Table({
    name: 'events.native_fills',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'order_hash', type: 'varchar' },
        { name: 'maker', type: 'varchar' },
        { name: 'taker', type: 'varchar' },
        { name: 'fee_recipient', type: 'varchar', isNullable: true },
        { name: 'maker_token', type: 'varchar' },
        { name: 'taker_token', type: 'varchar' },
        { name: 'maker_token_filled_amount', type: 'numeric' },
        { name: 'taker_token_filled_amount', type: 'numeric' },
        { name: 'maker_proxy_type', type: 'varchar', isNullable: true },
        { name: 'taker_proxy_type', type: 'varchar', isNullable: true },
        { name: 'maker_fee_paid', type: 'numeric', isNullable: true },
        { name: 'taker_fee_paid', type: 'numeric', isNullable: true },
        { name: 'maker_fee_token', type: 'varchar', isNullable: true },
        { name: 'taker_fee_token', type: 'varchar', isNullable: true },
        { name: 'protocol_fee_paid', type: 'numeric', isNullable: true },
        { name: 'pool', type: 'varchar', isNullable: true },
        { name: 'protocol_version', type: 'varchar' },
        { name: 'native_order_type', type: 'varchar', isNullable: true },
    ],
});


const createNativeFillsIndexQuery = `
    CREATE INDEX native_fills_transaction_hash_index
    ON events.native_fills (transaction_hash);

    CREATE INDEX native_fills_block_number_index
    ON events.native_fills (block_number);

    CREATE INDEX native_fills_maker_index
    ON events.native_fills (maker);
`;

const dropNativeFillsIndexQuery = `
    DROP INDEX events.native_fills_transaction_hash_index;
    DROP INDEX events.native_fills_block_number_index;
    DROP INDEX events.native_fills_maker_index;
`;

export class CreateV4FillsAndNativeFillsTables1610154951252 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(eventsRfqOrderFillsV4Table);
        await queryRunner.query(createRfqOrderFillsV4IndexQuery);
        await queryRunner.createTable(eventsLimitOrderFillsV4Table);
        await queryRunner.query(createLimitOrderFillsV4IndexQuery);
        await queryRunner.createTable(eventsNativeFillTable);
        await queryRunner.query(createNativeFillsIndexQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropRfqOrderFillsV4IndexQuery);
        await queryRunner.dropTable(eventsRfqOrderFillsV4Table);
        await queryRunner.query(dropLimitOrderFillsV4IndexQuery);
        await queryRunner.dropTable(eventsLimitOrderFillsV4Table);
        await queryRunner.query(dropNativeFillsIndexQuery);
        await queryRunner.dropTable(eventsNativeFillTable);
    }

}
