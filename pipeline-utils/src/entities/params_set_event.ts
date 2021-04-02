import { Column } from 'typeorm';

import { Event } from './event';
import { numberToBigIntTransformer, bigNumberTransformer } from '../transformers';
import { BigNumber } from '@0x/utils';

// Event emitted by MixinStake when a pool starts earning rewards in an epoch.
export abstract class ParamsSetEvent extends Event {
    // Minimum seconds between epochs.
    @Column({ name: 'epoch_duration_in_seconds', type: 'bigint', transformer: numberToBigIntTransformer })
    public epochDurationInSeconds!: number;
    // How much delegated stake is weighted vs operator stake, in ppm.
    @Column({ name: 'reward_delegated_stake_weight', type: 'bigint', transformer: numberToBigIntTransformer })
    public rewardDelegatedStakeWeight!: number;
    // Minimum amount of stake required in a pool to collect rewards.
    @Column({ name: 'minimum_pool_stake', type: 'numeric', transformer: bigNumberTransformer })
    public minimumPoolStake!: BigNumber;
    // Numerator for cobb douglas alpha factor.
    @Column({ name: 'cobb_douglas_alpa_numerator', type: 'bigint', transformer: numberToBigIntTransformer })
    public cobbDouglasAlphaNumerator!: number;
    // Denominator for cobb douglas alpha factor.
    @Column({ name: 'cobb_douglas_alpa_denominator', type: 'bigint', transformer: numberToBigIntTransformer })
    public cobbDouglasAlphaDenominator!: number;
}
