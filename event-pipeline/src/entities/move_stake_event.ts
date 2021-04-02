import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from '@0x/pipeline-utils';
import { bigNumberTransformer } from '@0x/pipeline-utils';

// Event emitted by MixinStake when the stake changes states.
@Entity({ name: 'move_stake_events', schema: 'events' })
export class MoveStakeEvent extends Event {
    // The address of the staker.
    @Column({ name: 'staker', type: 'varchar' })
    public staker!: string;
    // Amount moved
    @Column({ name: 'amount', type: 'numeric', transformer: bigNumberTransformer })
    public amount!: BigNumber;
    // Status prior to move
    @Column({ name: 'from_status', type: 'int' })
    public fromStatus!: number;
    // Pool prior to move
    @Column({ name: 'from_pool', type: 'varchar' })
    public fromPool!: string;
    // Status post move
    @Column({ name: 'to_status', type: 'int' })
    public toStatus!: number;
    @Column({ name: 'to_pool', type: 'varchar' })
    public toPool!: string;
}
