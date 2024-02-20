import { bigNumberTransformer, numberToBigIntTransformer } from '../transformers/big_number';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

// Event emitted by MixinFinalizer when an epoch has ended.
@Entity({ name: 'epoch_ended_events' })
export class EpochEndedEvent extends Event {
    // The epoch that ended.
    @Column({ name: 'epoch_id', type: 'bigint', transformer: numberToBigIntTransformer })
    public epochId!: number;
    // Number of pools that earned rewards during `epoch` and must be finalized.
    @Column({ name: 'num_pools_to_finalize', type: 'bigint', transformer: numberToBigIntTransformer })
    public numPoolsToFinalize!: number;
    // Rewards available to all pools that earned rewards during `epoch`.
    @Column({ name: 'rewards_available', type: 'numeric', transformer: bigNumberTransformer })
    public rewardsAvailable!: BigNumber;
    // Total fees collected across all pools that earned rewards during `epoch`.
    @Column({ name: 'total_fees_collected', type: 'numeric', transformer: bigNumberTransformer })
    public totalFeesCollected!: BigNumber;
    // Total weighted stake across all pools that earned rewards during `epoch`.
    @Column({ name: 'total_weighted_stake', type: 'numeric', transformer: bigNumberTransformer })
    public totalWeightedStake!: BigNumber;
}
