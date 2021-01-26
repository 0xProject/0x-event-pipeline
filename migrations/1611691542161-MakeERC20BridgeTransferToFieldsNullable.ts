import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

const eRC20BridgeTransferToFieldsNullable = [
    {
        oldColumn: new TableColumn({ name: 'to', type: 'varchar' }),
        newColumn: new TableColumn({ name: 'to', type: 'varchar', isNullable: true }),
    },
];

const eRC20BridgeTransferToFieldsNullableReverse = [
    {
        newColumn: new TableColumn({ name: 'to', type: 'varchar' }),
        oldColumn: new TableColumn({ name: 'to', type: 'varchar', isNullable: true }),
    },
];

export class MakeERC20BridgeTransferToFieldsNullable1611691542161 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.changeColumns('events.erc20_bridge_transfer_events', eRC20BridgeTransferToFieldsNullable);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.changeColumns('events.erc20_bridge_transfer_events', eRC20BridgeTransferToFieldsNullableReverse);
    }

}
