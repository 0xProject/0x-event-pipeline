import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class AddIndexUniswapV3SwapEvent1685571153000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          CREATE INDEX uniswap_v3_swap_events_observed_timestamp_idx ON ${schema}.uniswap_v3_swap_events (observed_timestamp);
`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          DROP INDEX uniswap_v3_swap_events_observed_timestamp_idx;
`);
    }
}
