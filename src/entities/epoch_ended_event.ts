import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { numberToBigIntTransformer, bigNumberTransformer } from '../utils';
import { BigNumber } from '@0x/utils';

// Event emitted by MixinFinalizer when an epoch has ended.
@Entity({ name: 'epoch_ended_events', schema: 'events' })
export class EpochEndedEvent extends Event {
    // The epoch that ended.
    @Column({ name: 'epoch_id', transformer: numberToBigIntTransformer })
    public epochId!: number;
    // Number of pools that earned rewards during `epoch` and must be finalized.
    @Column({ name: 'num_pools_to_finalize', transformer: numberToBigIntTransformer })
    public numPoolsToFinalize!: number;
    // Rewards available to all pools that earned rewards during `epoch`.
    @Column({ name: 'rewards_available', transformer: bigNumberTransformer })
    public rewardsAvailable!: BigNumber;
    // Total fees collected across all pools that earned rewards during `epoch`.
    @Column({ name: 'total_fees_collected', transformer: bigNumberTransformer })
    public totalFeesCollected!: BigNumber;
    // Total weighted stake across all pools that earned rewards during `epoch`.
    @Column({ name: 'total_weighted_stake', transformer: bigNumberTransformer })
    public totalWeightedStake!: BigNumber;
}