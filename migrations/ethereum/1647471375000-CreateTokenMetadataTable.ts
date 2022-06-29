import { MigrationInterface, QueryRunner } from 'typeorm';

const downQuery = `
DROP TABLE events.token_metadata;
`;

const upQuery = `
CREATE TABLE events.tokens_metadata (
  observed_timestamp int8 NOT NULL,
  address varchar NOT NULL,
  "type" varchar NOT NULL,
  symbol varchar NULL,
  "name" varchar NULL,
  decimals int8 NULL,
  CONSTRAINT tokens_metadata_pk PRIMARY KEY (address)
);
CREATE INDEX tokens_metadata_type_idx ON events.tokens_metadata USING btree (type);

INSERT INTO events.tokens_metadata (observed_timestamp,address,"type",symbol,"name","decimals")
  VALUES (0,'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee','Native','ETH','Ether',18);

`;

export class CreateTokenMetadataTable1647471375000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(upQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(downQuery);
    }
}
