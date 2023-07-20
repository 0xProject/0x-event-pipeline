import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreateEventsBackfillTable1683308483000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          CREATE TABLE ${schema}.events_backfill (
            name VARCHAR NOT NULL,
            block_number numeric NOT NULL,
            PRIMARY KEY (name, block_number)
          );
`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`DROP TABLE ${schema}.events_backfill;`);
    }
}
