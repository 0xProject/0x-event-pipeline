import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { numberToBigIntTransformer, bigNumberTransformer } from '../utils';
import { BigNumber } from '@0x/utils';

// Event emitted by MixinFinalizer when rewards are paid out to a pool.
@Entity({ name: 'rewards_paid_event', schema: 'events' })
export class RewardsPaidEvent extends Event {
    // The epoch when the rewards were earned.
    @Column({ name: 'epoch_id', transformer: numberToBigIntTransformer })
    public epochId!: number;
    // The pool's ID.
    @Column({ name: 'pool_id', type: 'varchar' })
    public poolId!: string;
    // Amount of reward paid to pool operator.
    @Column({ name: 'operator_reward', type: 'numeric', transformer: bigNumberTransformer })
    public operatorReward!: BigNumber;
    // Amount of reward paid to pool members.
    @Column({ name: 'nenbers_reward', type: 'numeric', transformer: bigNumberTransformer })
    public membersReward!: BigNumber;
}
