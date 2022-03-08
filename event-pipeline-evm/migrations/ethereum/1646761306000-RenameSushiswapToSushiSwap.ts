import { MigrationInterface, QueryRunner } from 'typeorm';

const updateQuery = `
UPDATE  events.erc20_bridge_transfer_events
SET direct_protocol = 'SushiSwap'
WHERE
  direct_flag AND
  direct_protocol ='Sushiswap';
`;

const rollbackQuery = `
UPDATE  events.erc20_bridge_transfer_events
SET direct_protocol = 'SushiSwap'
WHERE
  direct_flag AND
  direct_protocol ='Sushiswap';
`;

export class RenameSushiswapToSushiSwap1646761306000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(updateQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(rollbackQuery);
    }
}
