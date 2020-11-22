import { MigrationInterface, QueryRunner } from "typeorm";

const upQuery = `
    DROP VIEW IF EXISTS staking.address_pool_epoch_rewards;
    CREATE VIEW staking.address_pool_epoch_rewards (
        WITH rewards AS (
                SELECT rewards_paid_events.pool_id,
                    rewards_paid_events.epoch_id - 1 AS epoch_id,
                    rewards_paid_events.operator_reward / '1000000000000000000'::numeric AS operator_reward,
                    rewards_paid_events.members_reward / '1000000000000000000'::numeric AS members_reward,
                    (rewards_paid_events.operator_reward + rewards_paid_events.members_reward) / '1000000000000000000'::numeric AS total_reward
                FROM events.rewards_paid_events
                ), operator_rewards AS (
                SELECT r.pool_id,
                    r.epoch_id,
                    pi.operator AS address,
                    sum(r.operator_reward) AS reward
                FROM rewards r
                    JOIN staking.pool_info pi ON pi.pool_id::text = r.pool_id::text
                GROUP BY r.pool_id, r.epoch_id, pi.operator
                ), delegated_stake_at_start_by_delegator AS (
                SELECT e.epoch_id,
                    zsc.pool_id,
                    zsc.staker AS delegator,
                    sum(zsc.amount) AS zrx_delegated
                FROM staking.zrx_staking_changes zsc
                    LEFT JOIN events.staking_pool_created_events pce ON pce.pool_id::text = zsc.pool_id::text
                    LEFT JOIN staking.epochs e ON e.starting_block_number > zsc.block_number OR e.starting_block_number = zsc.block_number AND e.starting_transaction_index > zsc.transaction_index
                WHERE zsc.staker::text <> pce.operator_address::text
                GROUP BY e.epoch_id, zsc.pool_id, zsc.staker
                ), delegated_stake_at_start AS (
                SELECT delegated_stake_at_start_by_delegator.epoch_id,
                    delegated_stake_at_start_by_delegator.pool_id,
                    sum(delegated_stake_at_start_by_delegator.zrx_delegated) AS total_zrx_delegated
                FROM delegated_stake_at_start_by_delegator
                GROUP BY delegated_stake_at_start_by_delegator.epoch_id, delegated_stake_at_start_by_delegator.pool_id
                ), delegator_rewards AS (
                SELECT r.epoch_id,
                    r.pool_id,
                    dbd.delegator,
                    CASE WHEN r.members_reward = 0 THEN
                        0
                    ELSE
                        dbd.zrx_delegated / d.total_zrx_delegated * r.members_reward
                    END AS reward
                FROM rewards r
                    JOIN delegated_stake_at_start_by_delegator dbd ON dbd.pool_id::text = r.pool_id::text AND dbd.epoch_id = r.epoch_id
                    JOIN delegated_stake_at_start d ON d.pool_id::text = r.pool_id::text AND d.epoch_id = r.epoch_id
                )
        SELECT COALESCE(opr.address, dr.delegator) AS address,
            COALESCE(opr.pool_id, dr.pool_id) AS pool_id,
            COALESCE(opr.epoch_id, dr.epoch_id) AS epoch_id,
            COALESCE(opr.reward, 0::numeric) AS operator_reward,
            COALESCE(dr.reward, 0::numeric) AS member_reward,
            COALESCE(opr.reward, 0::numeric) + COALESCE(dr.reward, 0::numeric) AS total_reward
        FROM operator_rewards opr
            FULL JOIN delegator_rewards dr ON dr.delegator::text = opr.address::text AND dr.pool_id::text = opr.pool_id::text AND dr.epoch_id = opr.epoch_id
    );
`;

const downQuery = `
    DROP VIEW IF EXISTS staking.address_pool_epoch_rewards;
    CREATE VIEW staking.address_pool_epoch_rewards (
        WITH rewards AS (
                SELECT rewards_paid_events.pool_id,
                    rewards_paid_events.epoch_id - 1 AS epoch_id,
                    rewards_paid_events.operator_reward / '1000000000000000000'::numeric AS operator_reward,
                    rewards_paid_events.members_reward / '1000000000000000000'::numeric AS members_reward,
                    (rewards_paid_events.operator_reward + rewards_paid_events.members_reward) / '1000000000000000000'::numeric AS total_reward
                FROM events.rewards_paid_events
                ), operator_rewards AS (
                SELECT r.pool_id,
                    r.epoch_id,
                    pi.operator AS address,
                    sum(r.operator_reward) AS reward
                FROM rewards r
                    JOIN staking.pool_info pi ON pi.pool_id::text = r.pool_id::text
                GROUP BY r.pool_id, r.epoch_id, pi.operator
                ), delegated_stake_at_start_by_delegator AS (
                SELECT e.epoch_id,
                    zsc.pool_id,
                    zsc.staker AS delegator,
                    sum(zsc.amount) AS zrx_delegated
                FROM staking.zrx_staking_changes zsc
                    LEFT JOIN events.staking_pool_created_events pce ON pce.pool_id::text = zsc.pool_id::text
                    LEFT JOIN staking.epochs e ON e.starting_block_number > zsc.block_number OR e.starting_block_number = zsc.block_number AND e.starting_transaction_index > zsc.transaction_index
                WHERE zsc.staker::text <> pce.operator_address::text
                GROUP BY e.epoch_id, zsc.pool_id, zsc.staker
                ), delegated_stake_at_start AS (
                SELECT delegated_stake_at_start_by_delegator.epoch_id,
                    delegated_stake_at_start_by_delegator.pool_id,
                    sum(delegated_stake_at_start_by_delegator.zrx_delegated) AS total_zrx_delegated
                FROM delegated_stake_at_start_by_delegator
                GROUP BY delegated_stake_at_start_by_delegator.epoch_id, delegated_stake_at_start_by_delegator.pool_id
                ), delegator_rewards AS (
                SELECT r.epoch_id,
                    r.pool_id,
                    dbd.delegator,
                    dbd.zrx_delegated / d.total_zrx_delegated * r.members_reward AS reward
                FROM rewards r
                    JOIN delegated_stake_at_start_by_delegator dbd ON dbd.pool_id::text = r.pool_id::text AND dbd.epoch_id = r.epoch_id
                    JOIN delegated_stake_at_start d ON d.pool_id::text = r.pool_id::text AND d.epoch_id = r.epoch_id
                )
        SELECT COALESCE(opr.address, dr.delegator) AS address,
            COALESCE(opr.pool_id, dr.pool_id) AS pool_id,
            COALESCE(opr.epoch_id, dr.epoch_id) AS epoch_id,
            COALESCE(opr.reward, 0::numeric) AS operator_reward,
            COALESCE(dr.reward, 0::numeric) AS member_reward,
            COALESCE(opr.reward, 0::numeric) + COALESCE(dr.reward, 0::numeric) AS total_reward
        FROM operator_rewards opr
            FULL JOIN delegator_rewards dr ON dr.delegator::text = opr.address::text AND dr.pool_id::text = opr.pool_id::text AND dr.epoch_id = opr.epoch_id
    );
`;

export class HandleZeroRewardsSharingPoolsRewardsView1606052182276
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(upQuery);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(downQuery);
  }
}
