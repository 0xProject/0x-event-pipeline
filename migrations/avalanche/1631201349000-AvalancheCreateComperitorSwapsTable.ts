import { MigrationInterface, QueryRunner } from 'typeorm';

const createTable = `CREATE TABLE events_avalanche.competitor_swaps (
  competitor text NOT NULL,
	observed_timestamp int8 NOT NULL,
	contract_address varchar NOT NULL,
	transaction_hash varchar NOT NULL,
	transaction_index int8 NOT NULL,
	log_index int8 NOT NULL,
	block_hash varchar NOT NULL,
	block_number int8 NOT NULL,
	from_token varchar NOT NULL,
	to_token varchar NOT NULL,
	from_token_amount numeric NOT NULL,
	to_token_amount numeric NOT NULL,
	"from" varchar NOT NULL,
	"to" varchar NULL,
	CONSTRAINT avalanche_competitors_pkey PRIMARY KEY (transaction_hash, log_index)
);`;

const dropTable = `DROP TABLE events_avalanche.competitor_swaps;`;

export class AvalancheCreateComperitorSwapsTable1631201349000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(createTable);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(dropTable);
    }
}
