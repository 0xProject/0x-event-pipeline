import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreateTxBackfillTable1694795429000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS ${schema}.tx_backfill (
            transaction_hash varchar NULL,
            block_number int8 NULL
          );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`DROP TABLE ${schema}.tx_backfill;`);
    }
}
