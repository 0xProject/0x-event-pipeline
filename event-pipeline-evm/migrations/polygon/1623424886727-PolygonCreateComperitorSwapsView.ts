import { MigrationInterface, QueryRunner } from 'typeorm';

const createView = `CREATE VIEW events_polygon.competitor_swaps AS (
  SELECT
    '1inch' AS competitor,
    oneinch_swapped_events.*
  FROM events_polygon.oneinch_swapped_events

  UNION ALL

  SELECT
    'Slingshot' AS competitor,
    slingshot_trade_events.*
  FROM events_polygon.slingshot_trade_events
);`;

const dropView = `DROP VIEW events_polygon.competitor_swaps;`;

export class PolygonCreateComperitorSwapsView1623424886727 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createView);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropView);
    }
}
