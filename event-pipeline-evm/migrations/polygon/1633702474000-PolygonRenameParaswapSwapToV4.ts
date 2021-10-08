import { MigrationInterface, QueryRunner } from 'typeorm';

const renameTable = `ALTER TABLE events_polygon.paraswap_swapped_events RENAME TO paraswap_swapped_v4_events`;

const renameEventInLastProceesed = `
UPDATE events_polygon.last_block_processed
  SET event_name='ParaswapSwappediV4Event'
  WHERE event_name='ParaswapSwappedEvent';
`;

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
  FROM events_polygon.paraswap_swapped_v4_events
);`;

const undoRenameTable = `ALTER TABLE events_polygon.paraswap_swapped_v4_events RENAME TO paraswap_swapped_events`;
const dropView = `DROP VIEW events_polygon.competitor_swaps;`;
const undoRenameEventInLastProceesed = `
UPDATE events_polygon.last_block_processed
  SET event_name='ParaswapSwappediV4Event'
  WHERE event_name='ParaswapSwappedEvent';
`;

export class PolygonRenameParaswapSwapToV41633702474000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(renameTable);
        await queryRunner.query(renameEventInLastProceesed);
        await queryRunner.query(createView);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropView);
        await queryRunner.query(undoRenameEventInLastProceesed);
        await queryRunner.query(undoRenameTable);
    }
}
