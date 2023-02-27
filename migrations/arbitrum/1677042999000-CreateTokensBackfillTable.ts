import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreateTokensBackfillTabl1677042999000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          CREATE TABLE ${schema}.tokens_backfill (
            address VARCHAR NOT NULL,
            PRIMARY KEY (address)
          );
`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`DROP TABLE ${schema}.tokens_backfill;`);
    }
}
