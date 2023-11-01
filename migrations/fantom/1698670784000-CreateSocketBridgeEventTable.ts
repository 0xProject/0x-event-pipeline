import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreateSocketBridgeEventTable1698670784000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`
          CREATE TABLE ${schema}.socket_bridge_events (
            observed_timestamp BIGINT NOT NULL,
            contract_address VARCHAR NOT NULL,
            transaction_hash VARCHAR NOT NULL,
            transaction_index BIGINT NOT NULL,
            log_index BIGINT NOT NULL,
            block_hash VARCHAR NOT NULL,
            block_number BIGINT NOT NULL,
            amount NUMERIC NOT NULL,
            token VARCHAR NOT NULL,
            to_chain_id NUMERIC NOT NULL,
            bridge_name VARCHAR NOT NULL,
            sender VARCHAR NOT NULL,
            receiver VARCHAR NOT NULL,
            metadata VARCHAR NOT NULL,
            PRIMARY KEY (transaction_hash, log_index)
          );

          CREATE INDEX socket_bridge_events_block_number_idx ON ${schema}.socket_bridge_events (block_number);
          CREATE INDEX socket_bridge_events_sender_idx ON ${schema}.socket_bridge_events (sender);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`DROP TABLE ${schema}.socket_bridge_events;`);
    }
}
