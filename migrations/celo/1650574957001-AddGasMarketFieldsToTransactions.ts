import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class AddGasMarketFieldsToTransactions1650574957001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
            ALTER TABLE ${schema}.transactions ADD "type" int NULL;
            ALTER TABLE ${schema}.transactions ADD max_fee_per_gas int8 NULL;
            ALTER TABLE ${schema}.transactions ADD max_priority_fee_per_gas int8 NULL;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
            ALTER TABLE ${schema}.transactions DROP COLUMN "type";
            ALTER TABLE ${schema}.transactions DROP COLUMN max_fee_per_gas;
            ALTER TABLE ${schema}.transactions DROP COLUMN max_priority_fee_per_gas;
`);
    }
}
