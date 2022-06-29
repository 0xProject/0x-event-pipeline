import { MigrationInterface, QueryRunner } from 'typeorm';

const createView = `
CREATE OR REPLACE VIEW events_polygon.competitor_swaps AS (
  SELECT
    '1inch' AS competitor,
    *
  FROM events_polygon.oneinch_swapped_events

  UNION ALL

  SELECT
    'Slingshot' AS competitor,
    *
  FROM events_polygon.slingshot_trade_events

  UNION ALL

  SELECT
    'Paraswap' AS competitor,
    observed_timestamp,
    contract_address,
    transaction_hash,
    transaction_index,
    log_index,
    block_hash,
    block_number,
    from_token,
    to_token,
    from_token_amount,
    to_token_amount,
    "from",
    "to"
  FROM events_polygon.paraswap_swapped_events
);`;

const dropView = `DROP VIEW events_polygon.competitor_swaps;`;

export class PolygonAddParaswapToComperitorSwapsView1623862009237 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createView);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropView);
    }
}
