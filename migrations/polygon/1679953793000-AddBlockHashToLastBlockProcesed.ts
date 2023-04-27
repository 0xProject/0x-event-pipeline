import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class AddBlockHashToLastBlockProcesed1679953793000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
             ALTER TABLE ${schema}.last_block_processed ADD block_hash text NULL;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
             ALTER TABLE ${schema}.last_block_processed DROP COLUMN block_hash;
`);
    }
}
