import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../utils';

// Emitted whenever an `RfqOrder` is filled.
@Entity({ name: 'balancer_swap_events', schema: 'events' })
export class BalancerSwapEvent extends Event {

    @Column({ name: 'caller', type: 'varchar' })
    public caller!: string;
    @Column({ name: 'token_in', type: 'varchar' })
    public tokenIn!: string;
    @Column({ name: 'token_out', type: 'varchar' })
    public tokenOut!: string;
    @Column({ name: 'token_amount_in', type: 'numeric', transformer: bigNumberTransformer })
    public tokenAmountIn!: BigNumber;
    @Column({ name: 'token_amount_out', type: 'numeric', transformer: bigNumberTransformer })
    public tokenAmountOut!: BigNumber;

}
