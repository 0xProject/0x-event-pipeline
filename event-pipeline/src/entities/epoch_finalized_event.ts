import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { numberToBigIntTransformer, bigNumberTransformer } from '@0x/pipeline-utils';
import { BigNumber } from '@0x/utils';

// Event emitted by MixinFinalizer when an epoch has ended.
@Entity({ name: 'epoch_finalized_events', schema: 'events' })
export class EpochFinalizedEvent extends Event {
    // The epoch that ended.
    @Column({ name: 'epoch_id', type: 'bigint', transformer: numberToBigIntTransformer })
    public epochId!: number;
    // Rewards paid out when epoch was finalized
    @Column({ name: 'rewards_paid', type: 'numeric', transformer: bigNumberTransformer })
    public rewardsPaid!: BigNumber;
    // Rewards paid out when epoch was finalized
    @Column({ name: 'rewards_remaining', type: 'numeric', transformer: bigNumberTransformer })
    public rewardsRemaining!: BigNumber;
}
