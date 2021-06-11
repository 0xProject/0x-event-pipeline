import { MigrationInterface, QueryRunner } from 'typeorm';

const createView = `CREATE VIEW events_bsc.competitor_swaps AS (
  SELECT
    '1inch' AS competitor,
    oneinch_swapped_events.*
  FROM events_bsc.oneinch_swapped_events
);`;

const dropView = `DROP VIEW events_bsc.competitor_swaps;`;

export class BSCCreateComperitorSwapsView1623424886728 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createView);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropView);
    }
}
