import { MigrationInterface, QueryRunner, Table } from "typeorm";

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

const upQuery = `
    CREATE VIEW staking.pool_info AS (
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

    CREATE VIEW staking.current_epoch AS (
        SELECT
            epoch_id + 1 AS epoch_id
            , transaction_hash AS starting_transaction_hash
            , transaction_index AS starting_transaction_index
            , eee.block_number AS starting_block_number
            , TO_TIMESTAMP(b.block_timestamp) AS starting_block_timestamp
            , NULL::VARCHAR AS ending_transaction_hash
            , NULL::BIGINT AS ending_transaction_index
            , NULL::BIGINT AS ending_block_number
            , NULL::TIMESTAMPTZ AS ending_block_timestamp
        FROM events.epoch_ended_events eee
        LEFT JOIN events.blocks b ON b.block_number = eee.block_number
        ORDER BY epoch_id DESC
        LIMIT 1
    );

    CREATE VIEW staking.epochs AS (
        WITH
            past_epochs AS (
                SELECT
                    epoch_id
                    , CASE
                            WHEN epoch_id = 1 THEN spd.transaction_hash
                            ELSE LAG(eee.transaction_hash) OVER (ORDER BY epoch_id)
                        END AS starting_transaction_hash
                    , CASE
                            WHEN epoch_id = 1 THEN spd.transaction_index
                            ELSE LAG(eee.transaction_index) OVER (ORDER BY epoch_id)
                        END AS starting_transaction_index
                    , CASE
                            WHEN epoch_id = 1 THEN spd.block_number
                            ELSE LAG(eee.block_number) OVER (ORDER BY epoch_id)
                        END AS starting_block_number
                    , CASE
                            WHEN epoch_id = 1 THEN TO_TIMESTAMP(spd.block_timestamp)
                            ELSE TO_TIMESTAMP(LAG(b.block_timestamp) OVER (ORDER BY epoch_id))
                        END AS starting_block_timestamp
                    , eee.transaction_hash AS ending_transaction_hash
                    , eee.transaction_index AS ending_transaction_index
                    , eee.block_number AS ending_block_number
                    , TO_TIMESTAMP(b.block_timestamp) AS ending_timestamp
                FROM events.epoch_ended_events eee
                LEFT JOIN events.blocks b ON b.block_number = eee.block_number
                CROSS JOIN events.staking_proxy_deployment spd
            )
            SELECT * FROM past_epochs

            UNION ALL

            SELECT * FROM staking.current_epoch
    );

    CREATE VIEW staking.zrx_staking_changes AS (
        WITH
            additions AS (
                SELECT
                    to_pool AS pool_id
                    , staker
                    , block_number
                    , transaction_index
                    , amount / 1e18 AS amount
                FROM events.move_stake_events mse
                WHERE
                    -- delegated
                    to_status = 1
            )
            , removals AS (
                SELECT
                    from_pool AS pool_id
                    , staker
                    , block_number
                    , transaction_index
                    , -amount / 1e18 AS amount
                FROM events.move_stake_events mse
                WHERE
                    -- delegated
                    from_status = 1
            )
            SELECT * FROM additions

            UNION ALL

            SELECT * FROM removals
    );

    CREATE VIEW staking.zrx_staking_contract_changes AS (
        WITH
            additions AS (
                SELECT
                    staker
                    , block_number
                    , transaction_index
                    , amount / 1e18 AS amount
                FROM events.stake_events se
            )
            , removals AS (
                SELECT
                    staker
                    , block_number
                    , transaction_index
                    , -amount / 1e18 AS amount
                FROM events.unstake_events ue
            )
            SELECT * FROM additions

            UNION ALL

            SELECT * FROM removals
    );

    CREATE VIEW staking.operator_share_changes AS (
        SELECT
            block_number
            , transaction_index
            , pool_id
            , operator_share::NUMERIC / 1000000::NUMERIC AS operator_share
        FROM events.staking_pool_created_events

        UNION ALL

        SELECT
            block_number
            , transaction_index
            , pool_id
            , new_operator_share::NUMERIC / 1000000::NUMERIC AS operator_share
        FROM events.operator_share_decreased_events
    );

    CREATE VIEW staking.pool_epoch_operator_share AS (
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

    CREATE VIEW staking.current_params AS (
        SELECT
            *
        FROM events.params_set_events
        ORDER BY block_number DESC, transaction_index DESC
        LIMIT 1
    );

    CREATE VIEW staking.address_pool_epoch_rewards AS (
        WITH
            rewards AS (
                SELECT
                    pool_id
                    , epoch_id - 1 AS epoch_id
                    , operator_reward / 1e18 AS operator_reward
                    , members_reward / 1e18 AS members_reward
                    , (operator_reward + members_reward) / 1e18 AS total_reward
                FROM events.rewards_paid_events
            )
            , operator_rewards AS (
                SELECT
                    r.pool_id
                    , r.epoch_id
                    , pi.operator AS address
                    , SUM(operator_reward) AS reward
                FROM rewards r
                JOIN staking.pool_info pi ON pi.pool_id = r.pool_id
                GROUP BY 1,2,3
            )
            , delegated_stake_at_start_by_delegator AS (
                SELECT
                    e.epoch_id
                    , zsc.pool_id
                    , zsc.staker AS delegator
                    , SUM(zsc.amount) AS zrx_delegated
                FROM staking.zrx_staking_changes zsc
                LEFT JOIN events.staking_pool_created_events pce ON pce.pool_id = zsc.pool_id
                LEFT JOIN staking.epochs e
                    ON e.starting_block_number > zsc.block_number
                    OR (e.starting_block_number = zsc.block_number AND e.starting_transaction_index > zsc.transaction_index)
                WHERE
                    zsc.staker <> pce.operator_address
                GROUP BY 1,2,3
            )
            , delegated_stake_at_start AS (
                SELECT
                    epoch_id
                    , pool_id
                    , SUM(zrx_delegated) AS total_zrx_delegated
                FROM delegated_stake_at_start_by_delegator
                GROUP BY 1,2
            )
            , delegator_rewards AS (
                SELECT
                    r.epoch_id
                    , r.pool_id
                    , dbd.delegator
                    , (dbd.zrx_delegated / d.total_zrx_delegated) * r.members_reward AS reward
                FROM rewards r
                JOIN delegated_stake_at_start_by_delegator dbd ON
                    dbd.pool_id = r.pool_id
                    AND dbd.epoch_id = r.epoch_id
                JOIN delegated_stake_at_start d ON
                    d.pool_id = r.pool_id
                    AND d.epoch_id = r.epoch_id
            )
            SELECT
                COALESCE(opr.address,dr.delegator) AS address
                , COALESCE(opr.pool_id,dr.pool_id) AS pool_id
                , COALESCE(opr.epoch_id,dr.epoch_id) AS epoch_id
                , COALESCE(opr.reward,0) AS operator_reward
                , COALESCE(dr.reward,0) AS member_reward
                , COALESCE(opr.reward,0) + COALESCE(dr.reward,0) AS total_reward
            FROM operator_rewards opr
            FULL JOIN delegator_rewards dr ON
                dr.delegator = opr.address
                AND dr.pool_id = opr.pool_id
                AND dr.epoch_id = opr.epoch_id
    );
`;

const downQuery = `
    DROP VIEW IF EXISTS staking.pool_info CASCADE;
    DROP VIEW IF EXISTS staking.current_epoch CASCADE;
    DROP VIEW IF EXISTS staking.epochs CASCADE;
    DROP VIEW IF EXISTS staking.zrx_staking_changes CASCADE;
    DROP VIEW IF EXISTS staking.zrx_staking_contract_changes CASCADE;
    DROP VIEW IF EXISTS staking.operator_share_changes CASCADE;
    DROP VIEW IF EXISTS staking.pool_epoch_operator_share CASCADE;
    DROP VIEW IF EXISTS staking.maker_epochs CASCADE;
    DROP VIEW IF EXISTS staking.epoch_start_pool_status CASCADE;
    DROP VIEW IF EXISTS staking.current_params CASCADE;
    DROP VIEW IF EXISTS staking.address_pool_epoch_rewards CASCADE;
`;

export class AddStakingViews1573928462730 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(eventsStakingProxyDeploymentTable);
        await queryRunner.query(upQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(downQuery);
        await queryRunner.dropTable(eventsStakingProxyDeploymentTable);
    }

}
