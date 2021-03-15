import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

const nativeFillsColumnsToNullable = [
    {
        oldColumn: new TableColumn({ name: 'taker_token', type: 'varchar' }),
        newColumn: new TableColumn({ name: 'taker_token', type: 'varchar', isNullable: true }),
    },
    {
        oldColumn: new TableColumn({ name: 'maker_token', type: 'varchar' }),
        newColumn: new TableColumn({ name: 'maker_token', type: 'varchar', isNullable: true }),
    },
];

const nativeFillsColumnsToNullableReverse = [
    {
        newColumn: new TableColumn({ name: 'taker_token', type: 'varchar' }),
        oldColumn: new TableColumn({ name: 'taker_token', type: 'varchar', isNullable: true }),
    },
    {
        newColumn: new TableColumn({ name: 'maker_token', type: 'varchar' }),
        oldColumn: new TableColumn({ name: 'maker_token', type: 'varchar', isNullable: true }),
    },
];

export class MakeNativeOrderFieldsNullable1611340049005 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.changeColumns('events.native_fills', nativeFillsColumnsToNullable);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.changeColumns('events.native_fills', nativeFillsColumnsToNullableReverse);
    }

}
