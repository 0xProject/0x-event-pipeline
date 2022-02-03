import { MigrationInterface, QueryRunner } from 'typeorm';

const downQuery = `
DROP SCHEMA events_ropsten CASCADE;
`;

const upQuery = `
CREATE TABLE events_ropsten.expired_rfq_order_events (
  observed_timestamp int8 NOT NULL,
  contract_address varchar NOT NULL,
  transaction_hash varchar NOT NULL,
  transaction_index int8 NOT NULL,
  log_index int8 NOT NULL,
  block_hash varchar NOT NULL,
  block_number int8 NOT NULL,
  maker varchar NOT NULL,
  order_hash varchar NOT NULL,
  expiry numeric NOT NULL,
  PRIMARY KEY (transaction_hash, log_index)
);
CREATE INDEX expired_rfq_events_block_number_index ON events_ropsten.expired_rfq_order_events USING btree (block_number);
CREATE INDEX expired_rfq_events_maker_index ON events_ropsten.expired_rfq_order_events USING btree (maker);
CREATE INDEX expired_rfq_events_transaction_hash_index ON events_ropsten.expired_rfq_order_events USING btree (transaction_hash);

CREATE TABLE events_ropsten.otc_order_filled_events (
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
CREATE INDEX otc_order_filled_events_block_number_index ON events_ropsten.otc_order_filled_events USING btree (block_number);
CREATE INDEX otc_order_filled_events_maker_address_index ON events_ropsten.otc_order_filled_events USING btree (maker_address);
CREATE INDEX otc_order_filled_events_order_hash_index ON events_ropsten.otc_order_filled_events USING btree (order_hash);
CREATE INDEX otc_order_filled_events_transaction_hash_index ON events_ropsten.otc_order_filled_events USING btree (transaction_hash);

CREATE TABLE events_ropsten.v4_cancel_events (
  observed_timestamp int8 NOT NULL,
  contract_address varchar NOT NULL,
  transaction_hash varchar NOT NULL,
  transaction_index int8 NOT NULL,
  log_index int8 NOT NULL,
  block_hash varchar NOT NULL,
  block_number int8 NOT NULL,
  maker varchar NOT NULL,
  order_hash varchar NOT NULL,
  PRIMARY KEY (transaction_hash, log_index)
);
CREATE INDEX expired_rfq_events_order_hash_index ON events_ropsten.v4_cancel_events USING btree (order_hash);
CREATE INDEX v4_cancel_events_block_number_index ON events_ropsten.v4_cancel_events USING btree (block_number);
CREATE INDEX v4_cancel_events_maker_index ON events_ropsten.v4_cancel_events USING btree (maker);
CREATE INDEX v4_cancel_events_order_hash_index ON events_ropsten.v4_cancel_events USING btree (order_hash);
CREATE INDEX v4_cancel_events_transaction_hash_index ON events_ropsten.v4_cancel_events USING btree (transaction_hash);
`;

export class EnableNativeFeatures1643744238000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(upQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(downQuery);
    }
}
