import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class AddBlockNumberAndHashToTxLogs1683046483000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
             ALTER TABLE ${schema}.transaction_logs ADD block_hash text DEFAULT '0x';
             ALTER TABLE ${schema}.transaction_logs ADD block_number int8 NULL;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
             ALTER TABLE ${schema}.transaction_logs DROP COLUMN block_hash;
             ALTER TABLE ${schema}.transaction_logs DROP COLUMN block_number;
`);
    }
}
