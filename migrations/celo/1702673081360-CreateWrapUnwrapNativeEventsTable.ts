import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreateCeloWrapNativeEventsTable1702673081360 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
            CREATE TABLE ${schema}.wrap_native_events (
                observed_timestamp int8 NOT NULL,
                contract_address varchar NOT NULL,
                transaction_hash varchar NOT NULL,
                transaction_index int8 NOT NULL,
                log_index int8 NOT NULL,
                block_hash varchar NOT NULL,
                block_number int8 NOT NULL,
                dst varchar NOT NULL,
                wad numeric NOT NULL,
                PRIMARY KEY (transaction_hash, log_index)
            );
            CREATE INDEX wrap_native_events_block_number_index ON ${schema}.wrap_native_events USING btree (block_number);
            CREATE INDEX wrap_native_events_transaction_hash_index ON ${schema}.wrap_native_events USING btree (transaction_hash);

            CREATE TABLE ${schema}.unwrap_native_events (
                observed_timestamp int8 NOT NULL,
                contract_address varchar NOT NULL,
                transaction_hash varchar NOT NULL,
                transaction_index int8 NOT NULL,
                log_index int8 NOT NULL,
                block_hash varchar NOT NULL,
                block_number int8 NOT NULL,
                src varchar NOT NULL,
                wad numeric NOT NULL,
                PRIMARY KEY (transaction_hash, log_index)
            );
            CREATE INDEX unwrap_native_events_block_number_index ON ${schema}.unwrap_native_events USING btree (block_number);
            CREATE INDEX unwrap_native_events_transaction_hash_index ON ${schema}.unwrap_native_events USING btree (transaction_hash);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`DROP TABLE ${schema}.wrap_native_events;`);
        await queryRunner.query(`DROP TABLE ${schema}.unwrap_native_events;`);
    }
}
