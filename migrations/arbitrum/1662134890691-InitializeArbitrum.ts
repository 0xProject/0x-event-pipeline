import {MigrationInterface, QueryRunner} from "typeorm";

const downQuery = `
DROP SCHEMA events_arbitrum CASCADE;
`;

const upQuery = `
CREATE SCHEMA IF NOT EXISTS events_arbitrum;
CREATE TABLE events_arbitrum.blocks
(
  observed_timestamp bigint NOT NULL,
  block_hash varchar NOT NULL,
  block_number bigint NOT NULL,
  block_timestamp bigint NOT NULL,
  base_fee_per_gas bigint NULL,
  gas_used int8,
  PRIMARY KEY (block_number)
);
CREATE INDEX blocks_block_timestamp_index
  ON events_arbitrum.blocks (to_timestamp(block_timestamp::double precision));
CREATE TABLE events_arbitrum.last_block_processed
(
  event_name varchar NOT NULL,
  last_processed_block_number bigint,
  processed_timestamp bigint NOT NULL,
  last_processed_block_timestamp bigint,
  PRIMARY KEY (event_name)
);
CREATE TABLE events_arbitrum.erc20_bridge_transfer_events
(
  observed_timestamp bigint NOT NULL,
  contract_address varchar NOT NULL,
  transaction_hash varchar NOT NULL,
  transaction_index bigint NOT NULL,
  log_index bigint NOT NULL,
  block_hash varchar NOT NULL,
  block_number bigint NOT NULL,
  from_token varchar NOT NULL,
  to_token varchar NOT NULL,
  from_token_amount numeric NOT NULL,
  to_token_amount numeric NOT NULL,
  "from" varchar NOT NULL,
  "to" varchar,
  direct_flag boolean,
  direct_protocol varchar,
  PRIMARY KEY (transaction_hash, log_index)
);
CREATE INDEX bridge_trades_transaction_hash_index
  ON events_arbitrum.erc20_bridge_transfer_events (transaction_hash);
CREATE INDEX bridge_trades_block_number_index
  ON events_arbitrum.erc20_bridge_transfer_events (block_number);
CREATE INDEX bridge_trades_contract_address_index
  ON events_arbitrum.erc20_bridge_transfer_events (contract_address);
CREATE TABLE events_arbitrum.transactions
(
  observed_timestamp bigint NOT NULL,
  transaction_hash varchar NOT NULL,
  nonce bigint NOT NULL,
  block_hash varchar NOT NULL,
  block_number bigint NOT NULL,
  transaction_index bigint NOT NULL,
  sender_address varchar NOT NULL,
  to_address varchar,
  value numeric NOT NULL,
  gas_price numeric NOT NULL,
  gas numeric NOT NULL,
  INPUT varchar NOT NULL,
  affiliate_address varchar,
  quote_timestamp bigint,
  quote_id varchar,
  "type" int,
  max_fee_per_gas int8,
  max_priority_fee_per_gas int8,
  PRIMARY KEY (transaction_hash)
);
CREATE INDEX transactions_block_number_index
  ON events_arbitrum.transactions (block_number);
CREATE TABLE events_arbitrum.transformed_erc20_events
(
  observed_timestamp bigint NOT NULL,
  contract_address varchar NOT NULL,
  transaction_hash varchar NOT NULL,
  transaction_index bigint NOT NULL,
  log_index bigint NOT NULL,
  block_hash varchar NOT NULL,
  block_number bigint NOT NULL,
  taker varchar NOT NULL,
  input_token varchar NOT NULL,
  output_token varchar NOT NULL,
  input_token_amount numeric NOT NULL,
  output_token_amount numeric NOT NULL,
  PRIMARY KEY (transaction_hash, log_index)
);
CREATE INDEX transformed_erc20_transaction_hash_index
  ON events_arbitrum.transformed_erc20_events (transaction_hash);
CREATE INDEX transformed_erc20_block_number_index
  ON events_arbitrum.transformed_erc20_events (block_number);
CREATE INDEX transformed_erc20_taker_index
  ON events_arbitrum.transformed_erc20_events (taker);
CREATE TABLE events_arbitrum.transaction_receipts
(
  observed_timestamp bigint NOT NULL,
  transaction_hash varchar NOT NULL,
  block_hash varchar NOT NULL,
  block_number bigint NOT NULL,
  transaction_index bigint NOT NULL,
  sender_address varchar NOT NULL,
  to_address varchar,
  gas_used numeric NOT NULL,
  PRIMARY KEY (transaction_hash)
);
CREATE INDEX transaction_receipts_block_number_index
  ON events_arbitrum.transaction_receipts (block_number);
CREATE TABLE events_arbitrum.transaction_logs
(
  observed_timestamp bigint NOT NULL,
  transaction_hash varchar NOT NULL,
  logs varchar NOT NULL,
  PRIMARY KEY (transaction_hash)
);
CREATE TABLE events_arbitrum.v4_rfq_order_filled_events
(
  observed_timestamp bigint NOT NULL,
  contract_address varchar NOT NULL,
  transaction_hash varchar NOT NULL,
  transaction_index bigint NOT NULL,
  log_index bigint NOT NULL,
  block_hash varchar NOT NULL,
  block_number bigint NOT NULL,
  order_hash varchar NOT NULL,
  maker varchar NOT NULL,
  taker varchar NOT NULL,
  maker_token varchar NOT NULL,
  taker_token varchar NOT NULL,
  maker_token_filled_amount numeric NOT NULL,
  taker_token_filled_amount numeric NOT NULL,
  pool varchar NOT NULL,
  PRIMARY KEY (transaction_hash, log_index)
);
CREATE INDEX rfq_order_fills_v4_transaction_hash_index
  ON events_arbitrum.v4_rfq_order_filled_events (transaction_hash);
CREATE INDEX rfq_order_fills_v4_block_number_index
  ON events_arbitrum.v4_rfq_order_filled_events (block_number);
CREATE INDEX rfq_order_fills_v4_maker_index
  ON events_arbitrum.v4_rfq_order_filled_events (maker);
CREATE TABLE events_arbitrum.v4_limit_order_filled_events
(
  observed_timestamp bigint NOT NULL,
  contract_address varchar NOT NULL,
  transaction_hash varchar NOT NULL,
  transaction_index bigint NOT NULL,
  log_index bigint NOT NULL,
  block_hash varchar NOT NULL,
  block_number bigint NOT NULL,
  order_hash varchar NOT NULL,
  maker varchar NOT NULL,
  taker varchar NOT NULL,
  fee_recipient varchar NOT NULL,
  maker_token varchar NOT NULL,
  taker_token varchar NOT NULL,
  maker_token_filled_amount numeric NOT NULL,
  taker_token_filled_amount numeric NOT NULL,
  taker_token_fee_filled_amount numeric NOT NULL,
  protocol_fee_paid numeric NOT NULL,
  pool varchar NOT NULL,
  PRIMARY KEY (transaction_hash, log_index)
);
CREATE INDEX limit_order_fills_v4_transaction_hash_index
  ON events_arbitrum.v4_limit_order_filled_events (transaction_hash);
CREATE INDEX limit_order_fills_v4_block_number_index
  ON events_arbitrum.v4_limit_order_filled_events (block_number);
CREATE INDEX limit_order_fills_v4_maker_index
  ON events_arbitrum.v4_limit_order_filled_events (maker);
CREATE TABLE events_arbitrum.native_fills
(
  observed_timestamp bigint NOT NULL,
  contract_address varchar NOT NULL,
  transaction_hash varchar NOT NULL,
  transaction_index bigint NOT NULL,
  log_index bigint NOT NULL,
  block_hash varchar NOT NULL,
  block_number bigint NOT NULL,
  order_hash varchar NOT NULL,
  maker varchar NOT NULL,
  taker varchar NOT NULL,
  fee_recipient varchar,
  maker_token varchar,
  taker_token varchar,
  maker_token_filled_amount numeric NOT NULL,
  taker_token_filled_amount numeric NOT NULL,
  maker_proxy_type varchar,
  taker_proxy_type varchar,
  maker_fee_paid numeric,
  taker_fee_paid numeric,
  maker_fee_token varchar,
  taker_fee_token varchar,
  protocol_fee_paid numeric,
  pool varchar,
  protocol_version varchar NOT NULL,
  native_order_type varchar,
  PRIMARY KEY (transaction_hash, log_index)
);
CREATE INDEX native_fills_transaction_hash_index
  ON events_arbitrum.native_fills (transaction_hash);
CREATE INDEX native_fills_block_number_index
  ON events_arbitrum.native_fills (block_number);
CREATE INDEX native_fills_maker_index
  ON events_arbitrum.native_fills (maker);
`;

export class InitializeArbitrum1662134890691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(upQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(downQuery);
    }

}
