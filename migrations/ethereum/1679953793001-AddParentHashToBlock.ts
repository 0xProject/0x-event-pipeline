import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class AddParentHashToBlock1679953793001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
             ALTER TABLE ${schema}.blocks ADD parent_hash text DEFAULT '0x';
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
             ALTER TABLE ${schema}.blocks DROP COLUMN parent_hash;
`);
    }
}
