import { Column, Entity } from 'typeorm';

import { Event } from '@0x/pipeline-utils';
import { numberToBigIntTransformer, bigNumberTransformer } from '@0x/pipeline-utils';
import { BigNumber } from '@0x/utils';

// Event emitted by MixinFinalizer when rewards are paid out to a pool.
@Entity({ name: 'rewards_paid_events', schema: 'events' })
export class RewardsPaidEvent extends Event {
    // The epoch when the rewards were earned.
    @Column({ name: 'epoch_id', type: 'bigint', transformer: numberToBigIntTransformer })
    public epochId!: number;
    // The pool's ID.
    @Column({ name: 'pool_id', type: 'varchar' })
    public poolId!: string;
    // Amount of reward paid to pool operator.
    @Column({ name: 'operator_reward', type: 'numeric', transformer: bigNumberTransformer })
    public operatorReward!: BigNumber;
    // Amount of reward paid to pool members.
    @Column({ name: 'members_reward', type: 'numeric', transformer: bigNumberTransformer })
    public membersReward!: BigNumber;
}
