import { BigNumber } from '@0x/utils';
import { Column } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers';

export abstract class SlingshotTradeEvent extends Event {
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
    @Column({ name: 'from', type: 'varchar' })
    public from!: string;
    @Column({ name: 'to', type: 'varchar', nullable: true })
    public to!: string | null;
}
