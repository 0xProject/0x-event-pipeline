import {MigrationInterface, QueryRunner} from "typeorm";

const upQuery = `
DROP VIEW IF EXISTS staking.epoch_start_pool_status;
CREATE VIEW staking.epoch_start_pool_status AS (
    WITH
        makers_at_start AS (
            SELECT
                me.epoch_id
                , me.pool_id
                , ARRAY_AGG(me.maker_address) AS maker_addresses
            FROM staking.maker_epochs me
            GROUP BY 1,2
        )
        , delegated_stake_at_start AS (
            SELECT
                e.epoch_id
                , zsc.pool_id
                , SUM(CASE
                            WHEN zsc.staker = spce.operator_address THEN zsc.amount
                            ELSE 0.00
                        END) AS operator_zrx_delegated
                , SUM(CASE
                            WHEN zsc.staker <> spce.operator_address THEN zsc.amount
                            ELSE 0.00
                        END) AS member_zrx_delegated
                , SUM(zsc.amount) AS zrx_delegated
            FROM staking.zrx_staking_changes zsc
            LEFT JOIN events.staking_pool_created_events spce ON spce.pool_id = zsc.pool_id
            LEFT JOIN staking.epochs e
                ON e.starting_block_number > zsc.block_number
                OR (e.starting_block_number = zsc.block_number AND e.starting_transaction_index > zsc.transaction_index)
            GROUP BY 1,2
        )
        SELECT
            e.epoch_id
            , spc.pool_id
            , peos.operator_share AS operator_share
            , mas.maker_addresses
            , das.operator_zrx_delegated
            , das.member_zrx_delegated
            , das.zrx_delegated
        FROM events.staking_pool_created_events spc
        JOIN staking.epochs e
            ON e.starting_block_number > spc.block_number
            OR (e.starting_block_number = spc.block_number AND e.ending_transaction_index > spc.transaction_index)
        JOIN staking.pool_epoch_operator_share peos ON peos.epoch_id = e.epoch_id AND peos.pool_id = spc.pool_id
        LEFT JOIN makers_at_start mas ON mas.epoch_id = e.epoch_id AND mas.pool_id = spc.pool_id
        LEFT JOIN delegated_stake_at_start das ON das.epoch_id =e.epoch_id AND das.pool_id = spc.pool_id
);
`

const downQuery = `
DROP VIEW IF EXISTS staking.epoch_start_pool_status;
CREATE VIEW staking.epoch_start_pool_status AS (
    WITH
        makers_at_start AS (
            SELECT
                me.epoch_id
                , me.pool_id
                , ARRAY_AGG(me.maker_address) AS maker_addresses
            FROM staking.maker_epochs me
            GROUP BY 1,2
        )
        , delegated_stake_at_start AS (
            SELECT
                e.epoch_id
                , zsc.pool_id
                , SUM(zsc.amount) AS zrx_delegated
            FROM staking.zrx_staking_changes zsc
            LEFT JOIN staking.epochs e
                ON e.starting_block_number > zsc.block_number
                OR (e.starting_block_number = zsc.block_number AND e.starting_transaction_index > zsc.transaction_index)
            GROUP BY 1,2
        )
        SELECT
            e.epoch_id
            , spc.pool_id
            , peos.operator_share AS operator_share
            , mas.maker_addresses
            , das.zrx_delegated
        FROM events.staking_pool_created_events spc
        JOIN staking.epochs e
            ON e.starting_block_number > spc.block_number
            OR (e.starting_block_number = spc.block_number AND e.ending_transaction_index > spc.transaction_index)
        JOIN staking.pool_epoch_operator_share peos ON peos.epoch_id = e.epoch_id AND peos.pool_id = spc.pool_id
        LEFT JOIN makers_at_start mas ON mas.epoch_id = e.epoch_id AND mas.pool_id = spc.pool_id
        LEFT JOIN delegated_stake_at_start das ON das.epoch_id =e.epoch_id AND das.pool_id = spc.pool_id
);
`

export class AdjustEpochStartPoolStatusView1588185961270 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(upQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(downQuery);
    }

}
