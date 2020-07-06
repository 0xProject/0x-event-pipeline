import {MigrationInterface, QueryRunner} from "typeorm";

const upQuery = `
    CREATE OR REPLACE VIEW staking.pool_epoch_operator_share AS (
        SELECT DISTINCT
            osc.pool_id
            , e.epoch_id
            , LAST_VALUE(osc.operator_share)
                    OVER(
                        -- get the latest operator share by pool before
                        -- an epoch started
                        PARTITION BY osc.pool_id, e.epoch_id
                        ORDER BY osc.block_number, osc.transaction_index
                        RANGE BETWEEN
                            UNBOUNDED PRECEDING AND
                            UNBOUNDED FOLLOWING
                    ) AS operator_share
        FROM staking.epochs e
        JOIN staking.operator_share_changes osc
            ON osc.block_number < e.starting_block_number
            OR (osc.block_number = e.starting_block_number AND osc.transaction_index < e.starting_transaction_index)
    );
`;

const downQuery = `
    CREATE OR REPLACE VIEW staking.pool_epoch_operator_share AS (
        SELECT DISTINCT
            osc.pool_id
            , e.epoch_id
            , LAST_VALUE(osc.operator_share)
                    OVER(
                        PARTITION BY osc.pool_id
                        ORDER BY osc.block_number, osc.transaction_index
                        RANGE BETWEEN
                            UNBOUNDED PRECEDING AND
                            UNBOUNDED FOLLOWING
                    ) AS operator_share
        FROM staking.epochs e
        JOIN staking.operator_share_changes osc
            ON osc.block_number < e.starting_block_number
            OR (osc.block_number = e.starting_block_number AND osc.transaction_index < e.starting_transaction_index)
    );
`;

export class FixRewardsShared1591315195502 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(upQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(downQuery);
    }
}
