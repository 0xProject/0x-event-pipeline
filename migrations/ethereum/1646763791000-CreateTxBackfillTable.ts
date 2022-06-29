import { MigrationInterface, QueryRunner } from 'typeorm';

const createQuery = `
CREATE TABLE events.tx_backfill AS (
  SELECT DISTINCT
    transaction_hash,
    block_number
  FROM (
    (
      SELECT DISTINCT
        fe.transaction_hash,
        fe.block_number
      FROM events.native_fills fe
      LEFT JOIN events.transactions tx ON tx.transaction_hash = fe.transaction_hash
      WHERE
        (
          -- tx info hasn't been pulled
          tx.transaction_hash IS NULL OR
          -- or tx where the block info has changed
          tx.block_hash <> fe.block_hash
        )
    )
    UNION
    (
      SELECT DISTINCT
        terc20.transaction_hash,
        terc20.block_number
      FROM events.transformed_erc20_events terc20
      LEFT JOIN events.transactions tx ON tx.transaction_hash = terc20.transaction_hash
      WHERE
        (
          -- tx info hasn't been pulled
          tx.transaction_hash IS NULL OR
          -- or tx where the block info has changed
          tx.block_hash <> terc20.block_hash
        )
    )
    UNION
    (
      SELECT DISTINCT
        bte.transaction_hash,
        bte.block_number
      FROM events.erc20_bridge_transfer_events bte
      LEFT JOIN events.transactions tx ON tx.transaction_hash = bte.transaction_hash
      WHERE
        (
          -- tx info hasn't been pulled
          tx.transaction_hash IS NULL OR
          -- tx where the block info has changed
           tx.block_hash <> bte.block_hash
        ) AND
        direct_flag
    )
    UNION
    (
      SELECT DISTINCT
        fe.transaction_hash,
        fe.block_number
      FROM events.native_fills fe
      LEFT JOIN events.transaction_receipts tx ON tx.transaction_hash = fe.transaction_hash
      WHERE
        (
          -- tx info hasn't been pulled
          tx.transaction_hash IS NULL OR
          -- or tx where the block info has changed
          tx.block_hash <> fe.block_hash
        )
    )
    UNION
    (
      SELECT DISTINCT
        terc20.transaction_hash,
        terc20.block_number
      FROM events.transformed_erc20_events terc20
      LEFT JOIN events.transaction_receipts tx ON tx.transaction_hash = terc20.transaction_hash
      WHERE
        (
          -- tx info hasn't been pulled
          tx.transaction_hash IS NULL OR
          -- or tx where the block info has changed
          tx.block_hash <> terc20.block_hash
        )
    )
    UNION
    (
      SELECT DISTINCT
        bte.transaction_hash,
        bte.block_number
      FROM events.erc20_bridge_transfer_events bte
      LEFT JOIN events.transaction_receipts tx ON tx.transaction_hash = bte.transaction_hash
      WHERE
        (
          -- tx info hasn't been pulled
          tx.transaction_hash IS NULL OR
          -- tx where the block info has changed
           tx.block_hash <> bte.block_hash
        ) AND
        direct_flag
    )
    ) united
)
`;

const rollbackQuery = `
DROP TABLE events.tx_backfill;
`;

export class CreateTxBackfillTable1646763791000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(createQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(rollbackQuery);
    }
}
