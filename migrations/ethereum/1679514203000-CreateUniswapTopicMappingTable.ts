import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreatePoolTable1679514203000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE events.pools (
            observed_timestamp BIGINT NOT NULL,
            contract_address VARCHAR NOT NULL,
            token0 VARCHAR NOT NULL,
            token1 VARCHAR NOT NULL,
            protocolName VARCHAR NOT NULL,
            PRIMARY KEY (contract_address)
          );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE events.pools;`);
    }
}
