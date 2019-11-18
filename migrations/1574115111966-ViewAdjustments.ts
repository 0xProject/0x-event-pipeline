import {MigrationInterface, QueryRunner} from "typeorm";

const upQuery = `
    CREATE VIEW staking.maker_epochs AS (
        SELECT DISTINCT
            sps.maker_address
            , e.epoch_id
            , LAST_VALUE(sps.pool_id)
                OVER(
                    PARTITION BY sps.maker_address, e.epoch_id
                    ORDER BY sps.block_number, sps.transaction_index
                            RANGE BETWEEN
                                UNBOUNDED PRECEDING AND
                                UNBOUNDED FOLLOWING
                ) AS pool_id
        FROM staking.epochs e
        JOIN events.maker_staking_pool_set_events sps
            ON sps.block_number < e.starting_block_number
            OR (sps.block_number = e.starting_block_number AND sps.transaction_index < e.starting_transaction_index)
    );

    CREATE OR REPLACE VIEW staking.pool_info AS (
        WITH
            pools AS (
                SELECT
                    pool_id
                    , operator_address AS operator
                    , block_number AS created_at_block_number
                    , transaction_hash AS created_at_transaction_hash
                    , transaction_index AS created_at_transaction_index
                FROM events.staking_pool_created_events
            )
            , maker_current_pool AS (
                SELECT DISTINCT
                    maker_address
                    , LAST_VALUE(pool_id)
                        OVER(
                            PARTITION BY maker_address
                            ORDER BY block_number, transaction_index
                            RANGE BETWEEN
                                UNBOUNDED PRECEDING AND
                                UNBOUNDED FOLLOWING
                        ) AS pool_id
                FROM events.maker_staking_pool_set_events
            )
            , makers AS (
                SELECT
                    pool_id
                    , ARRAY_AGG(maker_address) AS maker_addresses
                FROM maker_current_pool
                GROUP BY 1
            )
            SELECT
                p.pool_id
                , p.operator
                , p.created_at_block_number
                , p.created_at_transaction_hash
                , p.created_at_transaction_index
                , m.maker_addresses
                , spm.verified
                , spm.logo_url
                , spm.location
                , spm.bio
                , spm.website
                , spm.name
            FROM pools p
            LEFT JOIN makers m ON m.pool_id = p.pool_id
            LEFT JOIN staking.staking_pool_metadata spm ON spm.pool_id = p.pool_id
    );

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

    CREATE OR REPLACE VIEW staking.epoch_start_pool_status AS (
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
`;

const downQuery = `
    DROP VIEW IF EXISTS staking.maker_epochs CASCADE;

    CREATE OR REPLACE VIEW staking.pool_info AS (
        WITH
            pools AS (
                SELECT
                    pool_id
                    , operator_address AS operator
                    , block_number AS created_at_block_number
                    , transaction_hash AS created_at_transaction_hash
                    , transaction_index AS created_at_transaction_index
                FROM events.staking_pool_created_events
            )
            , makers AS (
                SELECT
                    pool_id
                    , ARRAY_AGG(maker_address) AS maker_addresses
                FROM events.maker_staking_pool_set_events
                GROUP BY 1
            )
            SELECT
                p.pool_id
                , p.operator
                , p.created_at_block_number
                , p.created_at_transaction_hash
                , p.created_at_transaction_index
                , m.maker_addresses
                , spm.verified
                , spm.logo_url
                , spm.location
                , spm.bio
                , spm.website
                , spm.name
            FROM pools p
            LEFT JOIN makers m ON m.pool_id = p.pool_id
            LEFT JOIN staking.staking_pool_metadata spm ON spm.pool_id = p.pool_id
    );

    CREATE OR REPLACE VIEW staking.pool_epoch_operator_share AS (
        SELECT DISTINCT
            osc.pool_id
            , e.epoch_id
            , LAST_VALUE(osc.operator_share)
                OVER (PARTITION BY osc.pool_id ORDER BY osc.block_number, osc.transaction_index) AS operator_share
        FROM staking.epochs e
        JOIN staking.operator_share_changes osc
            ON osc.block_number < e.starting_block_number
            OR (osc.block_number = e.starting_block_number AND osc.transaction_index < e.starting_transaction_index)
    );

    CREATE OR REPLACE VIEW staking.epoch_start_pool_status AS (
        WITH
            makers_at_start AS (
                SELECT
                    e.epoch_id
                    , m.pool_id
                    , ARRAY_AGG(m.maker_address) AS maker_addresses
                FROM events.maker_staking_pool_set_events m
                LEFT JOIN staking.epochs e
                    ON e.starting_block_number > m.block_number
                    OR (e.starting_block_number = m.block_number AND e.starting_transaction_index > m.transaction_index)
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
            JOIN makers_at_start mas ON mas.epoch_id = e.epoch_id AND mas.pool_id = spc.pool_id
            JOIN delegated_stake_at_start das ON das.epoch_id =e.epoch_id AND das.pool_id = spc.pool_id
    );
`;

export class ViewAdjustments1574115111966 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(upQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(downQuery);
    }

}
