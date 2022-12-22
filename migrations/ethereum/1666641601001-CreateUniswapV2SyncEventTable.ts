import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreateUniswapV2SyncEventTable1666641601001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          CREATE TABLE ${schema}.uniswap_v2_sync_events (
            observed_timestamp NUMERIC NOT NULL,
            contract_address VARCHAR NOT NULL,
            transaction_hash VARCHAR NOT NULL,
            transaction_index NUMERIC NOT NULL,
            log_index NUMERIC NOT NULL,
            block_hash VARCHAR NOT NULL,
            block_number NUMERIC NOT NULL,
            reserve0 NUMERIC NOT NULL,
            reserve1 NUMERIC NOT NULL,
            PRIMARY KEY (transaction_hash, log_index)
          );

          CREATE INDEX uniswap_v2_sync_events_block_number_idx ON ${schema}.uniswap_v2_sync_events (block_number);
          CREATE INDEX uniswap_v2_sync_events_contract_address_idx ON ${schema}.uniswap_v2_sync_events (contract_address);
          CREATE INDEX uniswap_v2_sync_events_log_index_idx ON ${schema}.uniswap_v2_sync_events (log_index);

`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`DROP TABLE ${schema}.uniswap_v2_sync_event;`);
    }
}
