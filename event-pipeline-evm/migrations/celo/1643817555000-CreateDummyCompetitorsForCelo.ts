import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDummyCompetitorsForCelo1643817555000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE events_celo.competitor_swaps (
            competitor text,
            observed_timestamp int8,
            contract_address varchar,
            transaction_hash varchar,
            transaction_index int8,
            log_index int8,
            block_hash varchar,
            block_number int8,
            from_token varchar,
            to_token varchar,
            from_token_amount numeric,
            to_token_amount numeric,
            "from" varchar,
            "to" varchar
          );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('events_celo.competitor_swaps');
    }
}
