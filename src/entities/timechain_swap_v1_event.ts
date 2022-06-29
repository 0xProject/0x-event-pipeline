import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers';

// Timechain contract is not pubic, this event is an aproximation
@Entity({ name: 'timechain_swap_v1_events' })
export class TimechainSwapV1Event extends Event {
    // The address of the from token
    @Column({ name: 'from_token', type: 'varchar' })
    public fromToken!: string;
    // The address of the to token
    @Column({ name: 'to_token', type: 'varchar' })
    public toToken!: string;
    // The amount of the from token that was transfered
    @Column({ name: 'from_token_amount', type: 'numeric', transformer: bigNumberTransformer })
    public fromTokenAmount!: BigNumber;
    // The amount of the to token that was transfered
    @Column({ name: 'to_token_amount', type: 'numeric', transformer: bigNumberTransformer })
    public toTokenAmount!: BigNumber;
    @Column({ name: 'trader', type: 'varchar' })
    public trader!: string;
}
