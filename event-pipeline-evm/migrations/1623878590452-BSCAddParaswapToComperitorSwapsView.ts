import { MigrationInterface, QueryRunner } from 'typeorm';

const createView = `
DROP VIEW IF EXISTS events_bsc.competitor_swaps;
CREATE VIEW events_bsc.competitor_swaps AS (
  SELECT
    '1inch' AS competitor,
    *
  FROM events_bsc.oneinch_swapped_events

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
  FROM events_bsc.paraswap_swapped_events
);`;

const dropView = `DROP VIEW events_bsc.competitor_swaps;`;

export class BSCAddParaswapToComperitorSwapsView1623878590452 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createView);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropView);
    }
}
