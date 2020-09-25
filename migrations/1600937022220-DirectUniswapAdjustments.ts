import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

const bridgeTable = 'events.erc20_bridge_transfer_events';
const newBridgeColumns = [
    new TableColumn({ name: 'direct_flag', type: 'boolean', isNullable: true}),
    new TableColumn({ name: 'direct_protocol', type: 'varchar', isNullable: true}),
];

const lastProcessedTable = 'events.last_block_processed';
const newLastProcessedColumn = [
    new TableColumn({ name: 'last_processed_block_timestamp', type: 'bigint', isNullable: true}),
];

const changedLastProcessedColumn = [
    {
        oldColumn: new TableColumn({ name: 'last_processed_block_number', type: 'bigint' }),
        newColumn: new TableColumn({ name: 'last_processed_block_number', type: 'bigint', isNullable: true }),
    }
];

const changedLastProcessedColumnReversed = [
    {
        oldColumn: new TableColumn({ name: 'last_processed_block_number', type: 'bigint', isNullable: true }),
        newColumn: new TableColumn({ name: 'last_processed_block_number', type: 'bigint' }),
    }
];

export class DirectUniswapAdjustments1600937022220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns(bridgeTable, newBridgeColumns);
        await queryRunner.addColumns(lastProcessedTable, newLastProcessedColumn);
        await queryRunner.changeColumns(lastProcessedTable, changedLastProcessedColumn);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumns(bridgeTable, newBridgeColumns);
        await queryRunner.dropColumns(lastProcessedTable, newLastProcessedColumn);
        await queryRunner.changeColumns(lastProcessedTable, changedLastProcessedColumnReversed);
    }

}
