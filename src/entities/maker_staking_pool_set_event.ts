import { Column, Entity } from 'typeorm';

import { Event } from './event';

// Event emitted by MixinStake when a pool starts earning rewards in an epoch.
@Entity({ name: 'maker_staking_pool_set_events', schema: 'events' })
export class MakerStakingPoolSetEvent extends Event {
    // Adress of maker added to pool.
    @Column({ name: 'maker_address', type: 'varchar' })
    public makerAddress!: string;
    // The ID of the pool.
    @Column({ name: 'pool_id', type: 'varchar' })
    public poolId!: string;
}