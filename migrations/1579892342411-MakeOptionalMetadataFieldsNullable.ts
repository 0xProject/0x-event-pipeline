import { MigrationInterface, QueryRunner } from 'typeorm';

const upQuery = `
    ALTER TABLE staking.staking_pool_metadata ALTER COLUMN website DROP NOT NULL;
    ALTER TABLE staking.staking_pool_metadata ALTER COLUMN bio DROP NOT NULL;
    ALTER TABLE staking.staking_pool_metadata ALTER COLUMN location DROP NOT NULL;
    ALTER TABLE staking.staking_pool_metadata ALTER COLUMN logo_url DROP NOT NULL;
`
const downQuery = `
    ALTER TABLE staking.staking_pool_metadata ALTER COLUMN website SET NOT NULL;
    ALTER TABLE staking.staking_pool_metadata ALTER COLUMN bio SET NOT NULL;
    ALTER TABLE staking.staking_pool_metadata ALTER COLUMN location SET NOT NULL;
    ALTER TABLE staking.staking_pool_metadata ALTER COLUMN logo_url SET NOT NULL;
`

export class MakeOptionalMetadataFieldsNullable1579892342411 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
