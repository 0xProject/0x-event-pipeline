import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class AddDoneToTxBackfillTable1706550739000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          ALTER TABLE ${schema}.tx_backfill ADD CONSTRAINT tx_backfill_pk PRIMARY KEY (transaction_hash, block_number);
          ALTER TABLE ${schema}.tx_backfill ADD done boolean NOT NULL DEFAULT FALSE;
          CREATE INDEX tx_backfill_partial ON ${schema}.tx_backfill (transaction_hash, block_number)
WHERE done = FALSE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`ALTER TABLE ${schema}.tx_backfill UPDATE DROP COLUMN done;`);
    }
}
