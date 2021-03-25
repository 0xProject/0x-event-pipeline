import {MigrationInterface, QueryRunner} from "typeorm";

const insertUniswapETH_USDTPair = `
    INSERT INTO events.uniswap_pairs VALUES (
      '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
      10093341
    );
`;

const deleteUniswapETH_USDTPair = `
    DELETE FROM events.uniswap_pairs
    WHERE contract_address = '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852';
`;


export class AddUniswapETHUSDTPair1616605371056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(insertUniswapETH_USDTPair);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(deleteUniswapETH_USDTPair);
    }

}
