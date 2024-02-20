import { bigNumberTransformer } from '../transformers/big_number';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

// Event emitted by MixinStake when ZRX is unstaked.
@Entity({ name: 'unstake_events' })
export class UnstakeEvent extends Event {
    // The address of the staker.
    @Column({ name: 'staker' })
    public staker!: string;
    // Amount staked
    @Column({ name: 'amount', type: 'numeric', transformer: bigNumberTransformer })
    public amount!: BigNumber;
}
