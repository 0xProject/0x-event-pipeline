import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../utils';

// Event emitted by MixinStake when the stake changes states.
@Entity({ name: 'move_stake_events', schema: 'events' })
export class MoveStakeEvent extends Event {
    // The address of the staker.
    @Column({ name: 'staker' })
    public staker!: string;
    // Amount moved
    @Column({ name: 'amount', type: 'numeric', transformer: bigNumberTransformer })
    public amount!: BigNumber;
    // Status prior to move
    @Column({ name: 'from_status' })
    public fromStatus!: number;
    // Pool prior to move
    @Column({ name: 'from_pool' })
    public pool!: string;
    // Status post move
    @Column({ name: 'to_status' })
    public toStatus!: number;
    @Column({ name: 'to_pool' })
    public toPool!: string;
}