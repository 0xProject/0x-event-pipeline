import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreateOTCOrderFilledEventsTable1648567321000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;

        await queryRunner.query(`
CREATE TABLE ${schema}.otc_order_filled_events (
  observed_timestamp int8 NOT NULL,
  contract_address varchar NOT NULL,
  transaction_hash varchar NOT NULL,
  transaction_index int8 NOT NULL,
  log_index int8 NOT NULL,
  block_hash varchar NOT NULL,
  block_number int8 NOT NULL,
  order_hash varchar NOT NULL,
  maker_address varchar NOT NULL,
  taker_address varchar NOT NULL,
  maker_token_address varchar NOT NULL,
  taker_token_address varchar NOT NULL,
  maker_token_filled_amount numeric NOT NULL,
  taker_token_filled_amount numeric NOT NULL,
  PRIMARY KEY (transaction_hash, log_index)
);
CREATE INDEX otc_order_filled_events_block_number_index ON ${schema}.otc_order_filled_events USING brin (block_number);
CREATE INDEX otc_order_filled_events_maker_address_index ON ${schema}.otc_order_filled_events USING hash (maker_address);
CREATE INDEX otc_order_filled_events_order_hash_index ON ${schema}.otc_order_filled_events USING hash (order_hash);
CREATE INDEX otc_order_filled_events_transaction_hash_index ON ${schema}.otc_order_filled_events USING hash (transaction_hash);
`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;

        await queryRunner.query(`DROP TABLE ${schema}.otc_order_filled_events;`);
    }
}
