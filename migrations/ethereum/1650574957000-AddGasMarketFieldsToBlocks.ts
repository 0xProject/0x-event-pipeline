import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class AddGasMarketFieldsToBlocks1650574957000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
             ALTER TABLE ${schema}.blocks ADD base_fee_per_gas int8 NULL;
             ALTER TABLE ${schema}.blocks ADD gas_used int8 NULL;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
             ALTER TABLE ${schema}.blocks DROP COLUMN base_fee_per_gas;
             ALTER TABLE ${schema}.blocks DROP COLUMN gas_used;
`);
    }
}
