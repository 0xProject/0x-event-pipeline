-- Staking queries for API

-- Pool info
    DROP VIEW staking.pool_info;
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
    SELECT * FROM staking.pool_info;

    SELECT
        pi.pool_id
        , pi.operator
        , COUNT(*)
    FROM staking.pool_info pi
    LEFT JOIN events.fill_events fe
        ON pi.operator = fe.maker_address
    GROUP BY 1,2
    ORDER BY 1;

-- Current epoch
    DROP VIEW staking.current_epoch CASCADE;
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
    SELECT * FROM staking.current_epoch;

-- All epochs
    SELECT * FROM events.blocks WHERE block_number = 14425606;
    DROP VIEW staking.epochs;
    CREATE VIEW staking.epochs AS (
        WITH
            past_epochs AS (
                SELECT
                    epoch_id
                    , CASE
                            WHEN epoch_id = 1 THEN '0x683501fe77223124cb5d284155825dd0df29edbb70cd9f7315580fade2f8d269'
                            ELSE LAG(eee.transaction_hash) OVER (ORDER BY epoch_id)
                        END AS starting_transaction_hash
                    , CASE
                            WHEN epoch_id = 1 THEN 1
                            ELSE LAG(eee.transaction_index) OVER (ORDER BY epoch_id)
                        END AS starting_transaction_index
                    , CASE
                            WHEN epoch_id = 1 THEN 14425606
                            ELSE LAG(eee.block_number) OVER (ORDER BY epoch_id)
                        END AS starting_block_number
                    , CASE
                            WHEN epoch_id = 1 THEN TO_TIMESTAMP(1572225568)
                            ELSE TO_TIMESTAMP(LAG(b.block_timestamp) OVER (ORDER BY epoch_id))
                        END AS starting_block_timestamp
                    , eee.transaction_hash AS ending_transaction_hash
                    , eee.transaction_index AS ending_transaction_index
                    , eee.block_number AS ending_block_number
                    , TO_TIMESTAMP(b.block_timestamp) AS ending_timestamp
                FROM events.epoch_ended_events eee
                LEFT JOIN events.blocks b ON b.block_number = eee.block_number
            )
            SELECT * FROM past_epochs

            UNION ALL

            SELECT * FROM staking.current_epoch
    );

    SELECT * FROM staking.epochs;

-- ZRX movements in and out of pools
    DROP VIEW staking.zrx_staking_changes;
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
    SELECT * FROM staking.zrx_staking_changes LIMIT 100;

-- Operator Share changes
    DROP VIEW staking.operator_share_changes CASCADE ;
    CREATE OR REPLACE VIEW staking.operator_share_changes AS (
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

-- Operator Share by epoch
    DROP VIEW staking.pool_epoch_operator_share;
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

    SELECT * FROM staking.pool_epoch_operator_share;

-- Maker set changes
    DROP VIEW staking.maker_epochs CASCADE;
    CREATE OR REPLACE VIEW staking.maker_epochs AS (
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
    SELECT * FROM events.maker_staking_pool_set_events;
    SELECT * FROM staking.maker_epochs;

-- Pool status at the start of epochs
    DROP VIEW staking.epoch_start_pool_status;
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
    SELECT * FROM staking.epoch_start_pool_status LIMIT 100;

-- Current params
    DROP VIEW staking.current_params;
    CREATE OR REPLACE VIEW staking.current_params AS (
        SELECT
            *
        FROM events.params_set_events
        ORDER BY block_number DESC, transaction_index DESC
        LIMIT 1
    );
    SELECT * FROM staking.current_params;


-- Pools endpoint
    -- Current epoch info
        SELECT * FROM staking.current_epoch;

    -- Next Epoch Info
        SELECT
            ce.epoch_id + 1 AS epoch_id
            , ce.starting_block_number + cp.epoch_duration_in_seconds::NUMERIC / 15::NUMERIC AS starting_block_number
            , ce.starting_block_timestamp + ((cp.epoch_duration_in_seconds)::VARCHAR || ' seconds')::INTERVAL AS starting_timestamp
        FROM staking.current_epoch ce
        CROSS JOIN staking.current_params cp;

    -- basic pool info
        SELECT
            *
        FROM staking.pool_info;

    -- For Next epoch info for calculating approximate stake ratio
        WITH
            current_stake AS (
                SELECT
                    pi.pool_id
                    , SUM(zsc.amount) AS zrx_staked
                FROM staking.pool_info pi
                LEFT JOIN staking.zrx_staking_changes zsc ON zsc.pool_id = pi.pool_id
                GROUP BY 1
            )
            , current_epoch_fills_by_pool AS (
                SELECT
                    pi.pool_id
                    , SUM(fe.protocol_fee_paid) / 1e18 AS protocol_fees
                FROM events.fill_events fe
                LEFT JOIN staking.pool_info pi ON fe.maker_address = ANY(pi.maker_addresses)
                JOIN staking.current_epoch ce
                    ON fe.block_number > ce.starting_block_number
                    OR (fe.block_number = ce.starting_block_number AND fe.transaction_index >= ce.starting_transaction_index)
                WHERE
                    -- fees not accruing to a pool do not count
                    pool_id IS NOT NULL
                GROUP BY 1
            )
            , total_staked AS (
                SELECT
                    SUM(zrx_staked) AS total_staked
                FROM current_stake
            )
            , total_rewards AS (
                SELECT
                    SUM(protocol_fees) AS total_protocol_fees
                FROM current_epoch_fills_by_pool
            )
            , operator_share AS (
                SELECT DISTINCT
                    pool_id
                    , LAST_VALUE(operator_share) OVER (
                            PARTITION BY pool_id
                            ORDER BY block_number, transaction_index
                            RANGE BETWEEN
                            UNBOUNDED PRECEDING AND
                            UNBOUNDED FOLLOWING
                        )
                        AS operator_share
                FROM staking.operator_share_changes
            )
            SELECT
                pi.pool_id
                , pi.maker_addresses
                , os.operator_share
                , cs.zrx_staked
                , ts.total_staked
                , cs.zrx_staked / ts.total_staked AS share_of_stake
                , fbp.protocol_fees
                , tr.total_protocol_fees
                , fbp.protocol_fees / tr.total_protocol_fees AS share_of_fees
                , (cs.zrx_staked / ts.total_staked)
                      / (fbp.protocol_fees / tr.total_protocol_fees)
                    AS approximate_stake_ratio
            FROM staking.pool_info pi
            LEFT JOIN operator_share os ON os.pool_id = pi.pool_id
            LEFT JOIN current_stake cs ON cs.pool_id = pi.pool_id
            LEFT JOIN current_epoch_fills_by_pool fbp ON fbp.pool_id = pi.pool_id
            CROSS JOIN total_staked ts
            CROSS JOIN total_rewards tr;

    -- delegator shares
        SELECT
            pi.pool_id
            , CASE
                    WHEN staker = pi.operator THEN TRUE
                    ELSE FALSE
                END AS is_operator
            , staker AS delegator
            , SUM(zsc.amount) AS zrx_staked
        FROM staking.pool_info pi
        LEFT JOIN staking.zrx_staking_changes zsc ON zsc.pool_id = pi.pool_id
        GROUP BY 1,2,3;

    -- Current epoch info by pool
        WITH
            current_epoch_beginning_status AS (
                SELECT
                    esps.*
                FROM staking.epoch_start_pool_status esps
                JOIN staking.current_epoch ce ON ce.epoch_id = esps.epoch_id
            )
            , current_epoch_fills_by_pool AS (
                SELECT
                    ce.epoch_id
                    , cebs.pool_id
                    , SUM(fe.protocol_fee_paid) / 1e18 AS protocol_fees
                FROM events.fill_events fe
                LEFT JOIN current_epoch_beginning_status cebs ON fe.maker_address = ANY(cebs.maker_addresses)
                JOIN staking.current_epoch ce
                    ON fe.block_number > ce.starting_block_number
                    OR (fe.block_number = ce.starting_block_number AND fe.transaction_index >= ce.starting_transaction_index)
                WHERE
                    -- fees not accruing to a pool do not count
                    pool_id IS NOT NULL
                GROUP BY 1,2
            )
            SELECT
                pce.pool_id
                , cebs.zrx_delegated AS zrx_staked
                , cebs.operator_share AS operator_share
                , cebs.maker_addresses AS maker_addresses_set
                , fbp.protocol_fees AS protocol_fees_generated_in_eth
            FROM events.staking_pool_created_events pce
            LEFT JOIN current_epoch_beginning_status cebs ON cebs.pool_id = pce.pool_id
            LEFT JOIN current_epoch_fills_by_pool fbp ON fbp.epoch_id = cebs.epoch_id AND fbp.pool_id = cebs.pool_id;

    -- historical
        SELECT
            pool_id
            , epoch_id - 1 AS epoch_id
            , operator_reward::NUMERIC / 1e18::NUMERIC AS operator_reward
            , members_reward::NUMERIC / 1e18::NUMERIC AS members_reward
            , (operator_reward::NUMERIC + members_reward::NUMERIC) / 1e18 AS total_reward
        FROM events.rewards_paid_events;

-- Staking endpoint
    -- Current epoch info
        WITH
            zrx_staked AS (
                SELECT
                    SUM(esps.zrx_delegated) AS zrx_staked
                FROM staking.epoch_start_pool_status esps
                JOIN staking.current_epoch ce ON ce.epoch_id = esps.epoch_id
            )
            , protocol_fees AS (
                SELECT
                    SUM(protocol_fee_paid) / 1e18::NUMERIC AS protocol_fees
                FROM events.fill_events fe
                JOIN staking.current_epoch ce
                    ON fe.block_number > ce.starting_block_number
                    OR (fe.block_number = ce.starting_block_number AND fe.transaction_index > ce.starting_transaction_index)
            )
            , zrx_deposited AS (
                SELECT
                    SUM(scc.amount) AS zrx_deposited
                FROM staking.zrx_staking_contract_changes scc
                JOIN staking.current_epoch ce
                    ON scc.block_number < ce.starting_block_number
                    OR (scc.block_number = ce.starting_block_number AND scc.transaction_index < ce.starting_transaction_index)
            )
            SELECT
                ce.*
                , zd.zrx_deposited
                , zs.zrx_staked
                , pf.protocol_fees
            FROM staking.current_epoch ce
            CROSS JOIN zrx_deposited zd
            CROSS JOIN zrx_staked zs
            CROSS JOIN protocol_fees pf;

    -- Next epoch info
        WITH
            zrx_staked AS (
                SELECT
                    SUM(amount) AS zrx_staked
                FROM staking.zrx_staking_changes
            )
            , zrx_deposited AS (
                SELECT
                    SUM(scc.amount) AS zrx_deposited
                FROM staking.zrx_staking_contract_changes scc
            )
            SELECT
                ce.epoch_id + 1 AS epoch_id
                , ce.starting_block_number + cp.epoch_duration_in_seconds::NUMERIC / 15::NUMERIC AS starting_block_number
                , ce.starting_block_timestamp + ((cp.epoch_duration_in_seconds)::VARCHAR || ' seconds')::INTERVAL AS starting_timestamp
                , zd.zrx_deposited
                , zs.zrx_staked
            FROM staking.current_epoch ce
            CROSS JOIN staking.current_params cp
            CROSS JOIN zrx_staked zs
            CROSS JOIN zrx_deposited zd;

    -- Total rewards paid out historically in ETH
        SELECT
            SUM(
                COALESCE(operator_reward,0)
                + COALESCE(members_reward,0)
            ) / 1e18 AS total_rewards
        FROM events.rewards_paid_events;
            
-- Wizard endpoint data
    -- Return a list of staking pools with
        -- 1. ZRX staked
        -- 2. Fees collected (rolling 7-day)
        -- 3. Operator Share
        WITH
            operator_share AS (
                SELECT DISTINCT
                    pool_id
                    , LAST_VALUE(operator_share) OVER (
                            PARTITION BY pool_id
                            ORDER BY block_number, transaction_index
                            RANGE BETWEEN
                            UNBOUNDED PRECEDING AND
                            UNBOUNDED FOLLOWING
                        )
                        AS operator_share
                FROM staking.operator_share_changes
            )
            , current_stake AS (
                SELECT
                    pi.pool_id
                    , SUM(COALESCE(zsc.amount,0)) AS zrx_staked
                FROM staking.pool_info pi
                LEFT JOIN staking.zrx_staking_changes zsc ON zsc.pool_id = pi.pool_id
                GROUP BY 1
            )
            , past_7d_fills_fills_by_pool AS (
                SELECT
                    pi.pool_id
                    , SUM(fe.protocol_fee_paid) / 1e18 AS protocol_fees
                FROM events.fill_events fe
                LEFT JOIN events.blocks b ON b.block_number = fe.block_number
                LEFT JOIN staking.pool_info pi ON fe.maker_address = ANY(pi.maker_addresses)
                WHERE
                    -- fees not accruing to a pool do not count
                    pool_id IS NOT NULL
                    AND TO_TIMESTAMP(b.block_timestamp) > (CURRENT_TIMESTAMP - '7 days'::INTERVAL)
                GROUP BY 1
            )
            SELECT
                pi.pool_id
                , os.operator_share
                , cs.zrx_staked
                , f.protocol_fees
            FROM staking.pool_info pi
            JOIN operator_share os ON os.pool_id = pi.pool_id
            JOIN current_stake cs ON cs.pool_id = pi.pool_id
            LEFT JOIN past_7d_fills_fills_by_pool f ON f.pool_id = pi.pool_id
