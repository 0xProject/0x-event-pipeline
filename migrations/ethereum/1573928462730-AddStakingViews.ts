import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const eventsStakingProxyDeploymentTable = new Table({
    name: 'events.staking_proxy_deployment',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'block_timestamp', type: 'bigint' },
    ],
});

export class AddStakingViews1573928462730 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(eventsStakingProxyDeploymentTable);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(eventsStakingProxyDeploymentTable);
    }
}
