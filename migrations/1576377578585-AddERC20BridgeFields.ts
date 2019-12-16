import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

const targetTable = 'events.fill_events';
const newColumns = [
    new TableColumn({ name: 'taker_bridge_address', type: 'varchar', isNullable: true}),
    new TableColumn({ name: 'maker_bridge_address', type: 'varchar', isNullable: true}),
];

export class AddERC20BridgeFields1576377578585 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns(targetTable, newColumns);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumns(targetTable, newColumns);
    }

}
