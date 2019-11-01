import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { numberToBigIntTransformer } from '../utils';

// Event emitted by MixinStake when a pool starts earning rewards in an epoch.
@Entity({ name: 'staking_pool_earned_rewards_in_epoch_events', schema: 'events' })
export class StakingPoolEarnedRewardsInEpochEvent extends Event {
    // The epoch in which the pool earned rewards.
    @Column({ name: 'epoch', transformer: numberToBigIntTransformer })
    public epoch!: string;
    // The ID of the pool.
    @Column({ name: 'pool_id' })
    public poolId!: string;
}