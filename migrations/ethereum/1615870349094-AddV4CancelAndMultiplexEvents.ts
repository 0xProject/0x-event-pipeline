import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class AddV4CancelAndMultiplexEvents1615870349094 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          CREATE TABLE ${schema}.v4_cancel_events (
            observed_timestamp int8 NOT NULL,
            contract_address varchar NOT NULL,
            transaction_hash varchar NOT NULL,
            transaction_index int8 NOT NULL,
            log_index int8 NOT NULL,
            block_hash varchar NOT NULL,
            block_number int8 NOT NULL,
            maker varchar NOT NULL,
            order_hash varchar NOT NULL,
            CONSTRAINT v4_cancel_events_pk PRIMARY KEY (transaction_hash, log_index)
          );
          CREATE INDEX v4_xancel_events_order_hash_index ON ${schema}.v4_cancel_events USING btree (order_hash);
          CREATE INDEX v4_cancel_events_block_number_index ON ${schema}.v4_cancel_events USING btree (block_number);
          CREATE INDEX v4_cancel_events_maker_index ON ${schema}.v4_cancel_events USING btree (maker);
          CREATE INDEX v4_cancel_events_order_hash_index ON ${schema}.v4_cancel_events USING btree (order_hash);
          CREATE INDEX v4_cancel_events_transaction_hash_index ON ${schema}.v4_cancel_events USING btree (transaction_hash);

          CREATE TABLE ${schema}.expired_rfq_order_events (
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
            CONSTRAINT expired_rfq_order_events_pk PRIMARY KEY (transaction_hash, log_index)
          );
          CREATE INDEX expired_rfq_events_block_number_index ON ${schema}.expired_rfq_order_events USING btree (block_number);
          CREATE INDEX expired_rfq_events_maker_index ON ${schema}.expired_rfq_order_events USING btree (maker);
          CREATE INDEX expired_rfq_events_transaction_hash_index ON ${schema}.expired_rfq_order_events USING btree (transaction_hash);
`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          DROP TABLE ${schema}.v4_cancel_events;
          DROP TABLE ${schema}.expired_rfq_order_events;
        `);
    }
}
