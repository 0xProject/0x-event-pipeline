import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../utils';

// These events come directly from the a Uniswap Pair contract and are fired whenever
// someone swaps.
@Entity({ name: 'uniswap_swap_events', schema: 'events' })
export class UniswapSwapEvent extends Event {
    // The amount of the token0 from the pair that was transfered in
    @Column({ name: 'amount0_in', type: 'numeric', transformer: bigNumberTransformer })
    public amount0In!: BigNumber;
    // The amount of the token1 from the pair that was transfered in
    @Column({ name: 'amount1_in', type: 'numeric', transformer: bigNumberTransformer })
    public amount1In!: BigNumber;
    // The amount of the token0 from the pair that was transfered out
    @Column({ name: 'amount0_out', type: 'numeric', transformer: bigNumberTransformer })
    public amount0Out!: BigNumber;
    // The amount of the token1 from the pair that was transfered out
    @Column({ name: 'amount1_out', type: 'numeric', transformer: bigNumberTransformer })
    public amount1Out!: BigNumber;
    @Column({ name: 'from', type: 'varchar' })
    public from!: string;
    @Column({ name: 'to', type: 'varchar' })
    public to!: string;
}
