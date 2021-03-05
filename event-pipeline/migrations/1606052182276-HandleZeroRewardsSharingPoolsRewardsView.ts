import { MigrationInterface, QueryRunner } from "typeorm";

const upQuery = `
    DROP VIEW IF EXISTS staking.address_pool_epoch_rewards;
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
                    , CASE
                            WHEN d.total_zrx_delegated = 0 THEN 0
                            ELSE (dbd.zrx_delegated / d.total_zrx_delegated) * r.members_reward
                        END AS reward
                FROM rewards r
                JOIN delegated_stake_at_start_by_delegator dbd ON
                    dbd.pool_id = r.pool_id
                    AND dbd.epoch_id = r.epoch_id
                JOIN delegated_stake_at_start d ON
                    d.pool_id = r.pool_id
                    AND d.epoch_id = r.epoch_id
                WHERE
                    dbd.zrx_delegated > 0
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
    DROP VIEW IF EXISTS staking.address_pool_epoch_rewards;
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

export class HandleZeroRewardsSharingPoolsRewardsView1606052182276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(upQuery);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(downQuery);
  }
}
