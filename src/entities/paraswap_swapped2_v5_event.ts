import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers';

@Entity({ name: 'paraswap_swapped2_v5_events' })
export class ParaswapSwapped2V5Event extends Event {
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
    @Column({ name: 'expected_amount', type: 'numeric', transformer: bigNumberTransformer })
    public expectedAmount!: BigNumber;
    @Column({ name: 'uuid', type: 'varchar', nullable: false })
    public uuid!: string;
    // This is a packed field, do not use directly
    @Column({ name: 'fee_percent', type: 'varchar' })
    public feePercent!: string;
    // The address of the from token
    @Column({ name: 'partner', type: 'varchar' })
    public partner!: string;
}
