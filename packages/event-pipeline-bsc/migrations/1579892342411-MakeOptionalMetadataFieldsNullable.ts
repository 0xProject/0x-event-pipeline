import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const targetTable = 'staking.staking_pool_metadata';
const changedColumns = [
    {
        oldColumn: new TableColumn({ name: 'website', type: 'varchar' }),
        newColumn: new TableColumn({ name: 'website', type: 'varchar', isNullable: true }),
    },
    {
        oldColumn: new TableColumn({ name: 'bio', type: 'varchar' }),
        newColumn: new TableColumn({ name: 'bio', type: 'varchar', isNullable: true }),
    },
    {
        oldColumn: new TableColumn({ name: 'location', type: 'varchar' }),
        newColumn: new TableColumn({ name: 'location', type: 'varchar', isNullable: true }),
    },
    {
        oldColumn: new TableColumn({ name: 'logo_url', type: 'varchar' }),
        newColumn: new TableColumn({ name: 'logo_url', type: 'varchar', isNullable: true }),
    },
]
const changedColumnsReverse = [
    {
        newColumn: new TableColumn({ name: 'website', type: 'varchar' }),
        oldColumn: new TableColumn({ name: 'website', type: 'varchar', isNullable: true }),
    },
    {
        newColumn: new TableColumn({ name: 'bio', type: 'varchar' }),
        oldColumn: new TableColumn({ name: 'bio', type: 'varchar', isNullable: true }),
    },
    {
        newColumn: new TableColumn({ name: 'location', type: 'varchar' }),
        oldColumn: new TableColumn({ name: 'location', type: 'varchar', isNullable: true }),
    },
    {
        newColumn: new TableColumn({ name: 'logo_url', type: 'varchar' }),
        oldColumn: new TableColumn({ name: 'logo_url', type: 'varchar', isNullable: true }),
    },
]


export class MakeOptionalMetadataFieldsNullable1579892342411 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumns(targetTable, changedColumns);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumns(targetTable, changedColumnsReverse);
    }

}
