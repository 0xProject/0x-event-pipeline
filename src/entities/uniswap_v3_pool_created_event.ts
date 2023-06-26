import { Column, Entity } from 'typeorm';

import { Event } from './event';

@Entity({ name: 'uniswap_v3_pool_created_events' })
export class UniswapV3PoolCreatedEvent extends Event {
    // The address of token0
    @Column({ name: 'token0', type: 'varchar' })
    public token0!: string;
    // The address of token1
    @Column({ name: 'token1', type: 'varchar' })
    public token1!: string;
    // The fee collected upon every swap in the pool, denominated in hundredths of a bip
    @Column({ name: 'fee', type: 'integer' })
    public fee!: number;
    @Column({ name: 'tick_spacing', type: 'integer' })
    public tickSpacing!: number;
    // The address of the pool
    @Column({ name: 'pool', type: 'varchar' })
    public pool!: string;
}