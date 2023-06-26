import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreateUniswapV3PoolCreatedEventTable1687800088000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          CREATE TABLE ${schema}.uniswap_v3_pool_created_events (
            observed_timestamp NUMERIC NOT NULL,
            contract_address VARCHAR NOT NULL,
            transaction_hash VARCHAR NOT NULL,
            transaction_index NUMERIC NOT NULL,
            log_index NUMERIC NOT NULL,
            block_hash VARCHAR NOT NULL,
            block_number NUMERIC NOT NULL,
            token0 VARCHAR NOT NULL,
            token1 VARCHAR NOT NULL,
            fee INTEGER NOT NULL,
            tick_spacing INTEGER NOT NULL,
            pool VARCHAR NOT NULL,
            PRIMARY KEY (transaction_hash, log_index)
          );

          CREATE INDEX uniswap_v3_pool_created_events_block_number_idx ON ${schema}.uniswap_v3_pool_created_events (block_number);
          CREATE INDEX uniswap_v3_pool_created_events_token0_idx ON ${schema}.uniswap_v3_pool_created_events (token0);
          CREATE INDEX uniswap_v3_pool_created_events_token1_idx ON ${schema}.uniswap_v3_pool_created_events (token1);
          CREATE INDEX uniswap_v3_pool_created_events_pool_idx ON ${schema}.uniswap_v3_pool_created_events (pool);
`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`DROP TABLE ${schema}.uniswap_v3_pool_created_events;`);
    }
}