import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class NewBackfillTables1705420603000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          ALTER TABLE ${schema}.events_backfill RENAME TO backfill_events;

          CREATE TABLE ${schema}.backfill_blocks (
            block_number BIGINT NOT NULL,
            PRIMARY KEY (block_number)
          );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          DROP TABLE ${schema}.backfill_blocks;
          ALTER TABLE ${schema}.backfill_events RENAME TO events_backfill;
        `);
    }
}
