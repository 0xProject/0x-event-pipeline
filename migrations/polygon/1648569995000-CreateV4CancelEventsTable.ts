import { MigrationInterface, QueryRunner } from 'typeorm';

const downQuery = `
DROP TABLE events_polygon.v4_cancel_events;
`;

const upQuery = `
CREATE TABLE events_polygon.v4_cancel_events (
  observed_timestamp int8 NOT NULL,
  contract_address varchar NOT NULL,
  transaction_hash varchar NOT NULL,
  transaction_index int8 NOT NULL,
  log_index int8 NOT NULL,
  block_hash varchar NOT NULL,
  block_number int8 NOT NULL,
  maker varchar NOT NULL,
  order_hash varchar NOT NULL,
  CONSTRAINT "PK_a9c924efbe77b33db14d32f9abd" PRIMARY KEY (transaction_hash, log_index)
);
CREATE INDEX expired_rfq_events_order_hash_index ON events_polygon.v4_cancel_events USING hash (order_hash);
CREATE INDEX v4_cancel_events_block_number_index ON events_polygon.v4_cancel_events USING brin (block_number);
CREATE INDEX v4_cancel_events_maker_index ON events_polygon.v4_cancel_events USING hash (maker);
CREATE INDEX v4_cancel_events_order_hash_index ON events_polygon.v4_cancel_events USING hash (order_hash);
CREATE INDEX v4_cancel_events_transaction_hash_index ON events_polygon.v4_cancel_events USING hash (transaction_hash);
`;

export class CreateV4CancelEventsTable1648569995000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(upQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(downQuery);
    }
}
