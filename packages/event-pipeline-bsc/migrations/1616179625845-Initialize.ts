import {MigrationInterface, QueryRunner} from "typeorm";


const downQuery = `
DROP SCHEMA events_bsc CASCADE;
`;

const upQuery = `
create schema events_bsc;

create table events_bsc.blocks
(
	observed_timestamp bigint not null,
	block_hash varchar not null,
	block_number bigint not null
		constraint "PK_02e182b15efd25257278516a66e"
			primary key,
	block_timestamp bigint not null
);

create index blocks_block_timestamp_index
	on events_bsc.blocks (to_timestamp(block_timestamp::double precision));

create table events_bsc.last_block_processed
(
	event_name varchar not null
		constraint "PK_70d0a2b7942e91153b24d05081a"
			primary key,
	last_processed_block_number bigint,
	processed_timestamp bigint not null,
	last_processed_block_timestamp bigint
);

create table events_bsc.erc20_bridge_transfer_events
(
	observed_timestamp bigint not null,
	contract_address varchar not null,
	transaction_hash varchar not null,
	transaction_index bigint not null,
	log_index bigint not null,
	block_hash varchar not null,
	block_number bigint not null,
	from_token varchar not null,
	to_token varchar not null,
	from_token_amount numeric not null,
	to_token_amount numeric not null,
	"from" varchar not null,
	"to" varchar,
	direct_flag boolean,
	direct_protocol varchar,
	constraint "PK_0e29a12f959d1552d589f49c66a"
		primary key (transaction_hash, log_index)
);

create index bridge_trades_transaction_hash_index
	on events_bsc.erc20_bridge_transfer_events (transaction_hash);

create index bridge_trades_block_number_index
	on events_bsc.erc20_bridge_transfer_events (block_number);

create index bridge_trades_contract_address_index
	on events_bsc.erc20_bridge_transfer_events (contract_address);

create table events_bsc.transactions
(
	observed_timestamp bigint not null,
	transaction_hash varchar not null
		constraint "PK_1b0cab8dc462ab6930c77f46fb9"
			primary key,
	nonce bigint not null,
	block_hash varchar not null,
	block_number bigint not null,
	transaction_index bigint not null,
	sender_address varchar not null,
	to_address varchar,
	value numeric not null,
	gas_price numeric not null,
	gas numeric not null,
	input varchar not null,
	affiliate_address varchar,
	quote_timestamp bigint,
	quote_id varchar
);

create index transactions_block_number_index
	on events_bsc.transactions (block_number);

create table events_bsc.transformed_erc20_events
(
	observed_timestamp bigint not null,
	contract_address varchar not null,
	transaction_hash varchar not null,
	transaction_index bigint not null,
	log_index bigint not null,
	block_hash varchar not null,
	block_number bigint not null,
	taker varchar not null,
	input_token varchar not null,
	output_token varchar not null,
	input_token_amount numeric not null,
	output_token_amount numeric not null,
	constraint "PK_0be3810ab81e5203863ed8f47fd"
		primary key (transaction_hash, log_index)
);

create index transformed_erc20_transaction_hash_index
	on events_bsc.transformed_erc20_events (transaction_hash);

create index transformed_erc20_block_number_index
	on events_bsc.transformed_erc20_events (block_number);

create index transformed_erc20_taker_index
	on events_bsc.transformed_erc20_events (taker);

create table events_bsc.transaction_receipts
(
	observed_timestamp bigint not null,
	transaction_hash varchar not null
		constraint "PK_f8da2b9fddd2e1dfe6fc123ff65"
			primary key,
	block_hash varchar not null,
	block_number bigint not null,
	transaction_index bigint not null,
	sender_address varchar not null,
	to_address varchar,
	gas_used numeric not null
);

create index transaction_receipts_block_number_index
	on events_bsc.transaction_receipts (block_number);

create table events_bsc.transaction_logs
(
	observed_timestamp bigint not null,
	transaction_hash varchar not null
		constraint "PK_a868a319ea2a6c3a34dece1c931"
			primary key,
	logs varchar not null
);

create table events_bsc.v4_rfq_order_filled_events
(
	observed_timestamp bigint not null,
	contract_address varchar not null,
	transaction_hash varchar not null,
	transaction_index bigint not null,
	log_index bigint not null,
	block_hash varchar not null,
	block_number bigint not null,
	order_hash varchar not null,
	maker varchar not null,
	taker varchar not null,
	maker_token varchar not null,
	taker_token varchar not null,
	maker_token_filled_amount numeric not null,
	taker_token_filled_amount numeric not null,
	pool varchar not null,
	constraint "PK_e57eebe99dad075927c8ee4f6b4"
		primary key (transaction_hash, log_index)
);

create index rfq_order_fills_v4_transaction_hash_index
	on events_bsc.v4_rfq_order_filled_events (transaction_hash);

create index rfq_order_fills_v4_block_number_index
	on events_bsc.v4_rfq_order_filled_events (block_number);

create index rfq_order_fills_v4_maker_index
	on events_bsc.v4_rfq_order_filled_events (maker);

create table events_bsc.v4_limit_order_filled_events
(
	observed_timestamp bigint not null,
	contract_address varchar not null,
	transaction_hash varchar not null,
	transaction_index bigint not null,
	log_index bigint not null,
	block_hash varchar not null,
	block_number bigint not null,
	order_hash varchar not null,
	maker varchar not null,
	taker varchar not null,
	fee_recipient varchar not null,
	maker_token varchar not null,
	taker_token varchar not null,
	maker_token_filled_amount numeric not null,
	taker_token_filled_amount numeric not null,
	taker_token_fee_filled_amount numeric not null,
	protocol_fee_paid numeric not null,
	pool varchar not null,
	constraint "PK_9ae2dc2d227afe610901c257702"
		primary key (transaction_hash, log_index)
);

create index limit_order_fills_v4_transaction_hash_index
	on events_bsc.v4_limit_order_filled_events (transaction_hash);

create index limit_order_fills_v4_block_number_index
	on events_bsc.v4_limit_order_filled_events (block_number);

create index limit_order_fills_v4_maker_index
	on events_bsc.v4_limit_order_filled_events (maker);

create table events_bsc.native_fills
(
	observed_timestamp bigint not null,
	contract_address varchar not null,
	transaction_hash varchar not null,
	transaction_index bigint not null,
	log_index bigint not null,
	block_hash varchar not null,
	block_number bigint not null,
	order_hash varchar not null,
	maker varchar not null,
	taker varchar not null,
	fee_recipient varchar,
	maker_token varchar,
	taker_token varchar,
	maker_token_filled_amount numeric not null,
	taker_token_filled_amount numeric not null,
	maker_proxy_type varchar,
	taker_proxy_type varchar,
	maker_fee_paid numeric,
	taker_fee_paid numeric,
	maker_fee_token varchar,
	taker_fee_token varchar,
	protocol_fee_paid numeric,
	pool varchar,
	protocol_version varchar not null,
	native_order_type varchar,
	constraint "PK_41df909290d0a87a523a13e0229"
		primary key (transaction_hash, log_index)
);

create index native_fills_transaction_hash_index
	on events_bsc.native_fills (transaction_hash);

create index native_fills_block_number_index
	on events_bsc.native_fills (block_number);

create index native_fills_maker_index
	on events_bsc.native_fills (maker);
`;

export class Initialize1616179625845 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(upQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(downQuery);
    }

}
