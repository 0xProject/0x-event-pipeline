import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const eventsUniswapPairsTable = new Table({
    name: 'events.uniswap_pairs',
    columns: [
        { name: 'contract_address', type: 'varchar', isPrimary: true },
        { name: 'token0_address', type: 'varchar' },
        { name: 'token1_address', type: 'varchar' },
        { name: 'block_number', type: 'bigint' }
    ],
});

const createUniswapPairsIndexQuery = `
    CREATE INDEX uniswap_pairs_token0_index
    ON events.uniswap_pairs (token0_address);

    CREATE INDEX uniswap_pairs_token1_index
    ON events.uniswap_pairs (token1_address);
`;

const dropUniswapPairsIndexQuery = `
    DROP INDEX events.uniswap_pairs_token0_index;
    DROP INDEX events.uniswap_pairs_token1_index;
`;

const eventsUniswapSwapEventsTable = new Table({
    name: 'events.uniswap_swap_events',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'amount0_in', type: 'numeric' },
        { name: 'amount1_in', type: 'numeric' },
        { name: 'amount0_out', type: 'numeric' },
        { name: 'amount1_out', type: 'numeric' },
        { name: 'from', type: 'varchar' },
        { name: 'to', type: 'varchar' },
    ],
});

const createUniswapSwapsIndexQuery = `
    CREATE INDEX uniswap_swaps_transaction_hash_index
    ON events.uniswap_swap_events (transaction_hash);

    CREATE INDEX uniswap_swaps_block_number_index
    ON events.uniswap_swap_events (block_number);

    CREATE INDEX uniswap_swaps_contract_address_index
    ON events.uniswap_swap_events (contract_address);
`;

const dropUniswapSwapsIndexQuery = `
    DROP INDEX events.uniswap_swaps_transaction_hash_index;
    DROP INDEX events.uniswap_swaps_block_number_index;
    DROP INDEX events.uniswap_swaps_contract_address_index;
`;

export class AddUniswapRawSwaps1616456659271 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(eventsUniswapPairsTable);
        await queryRunner.query(createUniswapPairsIndexQuery);

        await queryRunner.createTable(eventsUniswapSwapEventsTable);
        await queryRunner.query(createUniswapSwapsIndexQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropUniswapSwapsIndexQuery);
        await queryRunner.dropTable(eventsUniswapSwapEventsTable);

        await queryRunner.query(dropUniswapPairsIndexQuery);
        await queryRunner.dropTable(eventsUniswapPairsTable);
    }
}
