import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { numberToBigIntTransformer } from '@0x/pipeline-utils';

// Event emitted by MixinStake when a pool starts earning rewards in an epoch.
@Entity({ name: 'staking_pool_earned_rewards_in_epoch_events', schema: 'events' })
export class StakingPoolEarnedRewardsInEpochEvent extends Event {
    // The epoch in which the pool earned rewards.
    @Column({ name: 'epoch_id', type: 'bigint', transformer: numberToBigIntTransformer })
    public epochId!: number;
    // The ID of the pool.
    @Column({ name: 'pool_id', type: 'varchar' })
    public poolId!: string;
}
