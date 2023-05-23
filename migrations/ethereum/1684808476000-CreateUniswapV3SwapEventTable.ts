import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreateUniswapV3SwapEventTable1684808476000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          CREATE TABLE ${schema}.uniswap_v3_swap_events (
            observed_timestamp NUMERIC NOT NULL,
            contract_address VARCHAR NOT NULL,
            transaction_hash VARCHAR NOT NULL,
            transaction_index NUMERIC NOT NULL,
            log_index NUMERIC NOT NULL,
            block_hash VARCHAR NOT NULL,
            block_number NUMERIC NOT NULL,
            sender VARCHAR NOT NULL,
            recipient VARCHAR NOT NULL,
            amount0 NUMERIC NOT NULL,
            amount1 NUMERIC NOT NULL,
            sqrtPriceX96 NUMERIC NOT NULL,
            liquidity NUMERIC NOT NULL, 
            tick INTEGER NOT NULL,
            PRIMARY KEY (transaction_hash, log_index)
          );

          CREATE INDEX uniswap_v3_swap_events_transaction_hash_idx ON ${schema}.uniswap_v3_swap_events (transaction_hash);
          CREATE INDEX uniswap_v3_swap_events_block_number_idx ON ${schema}.uniswap_v3_swap_events (block_number);
          CREATE INDEX uniswap_v3_swap_events_contract_address_idx ON ${schema}.uniswap_v3_swap_events (contract_address);
`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          DROP INDEX uniswap_v3_swap_events_transaction_hash_idx;
          DROP INDEX uniswap_v3_swap_events_block_number_idx;
          DROP INDEX uniswap_v3_swap_events_contract_address_idx;

          DROP TABLE ${schema}.uniswap_v3_swap_events;
`);
    }
}
