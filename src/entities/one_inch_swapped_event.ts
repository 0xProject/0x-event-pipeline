import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../utils';

// These events come directly from the 1inch contract and are fired whenever
// a token swapping takes place.
// ABI's ref: https://api.etherscan.io/api?module=contract&action=getabi&address=0x3eba4336549fc5cbebe8b093ce6d1c39d3ba06e6
@Entity({ name: 'oneinch_swapped_events', schema: 'events' })
export class OneInchSwappedEvent extends Event {
    // The address of the from token
    @Column({ name: 'src_token', type: 'varchar' })
    public srcToken!: string;
    // The address of the to token
    @Column({ name: 'dst_token', type: 'varchar' })
    public dstToken!: string;
    // The amount of the srcToken token that was transferred
    @Column({ name: 'amount', type: 'numeric', transformer: bigNumberTransformer })
    public amount!: BigNumber;
    @Column({ name: 'spent_amount', type: 'numeric', transformer: bigNumberTransformer })
    public spentAmount!: BigNumber;
    @Column({ name: 'return_amount', type: 'numeric', transformer: bigNumberTransformer })
    public returnAmount!: BigNumber;
    @Column({ name: 'min_return_amount', type: 'numeric', transformer: bigNumberTransformer })
    public minReturnAmount!: BigNumber;
    @Column({ name: 'guaranteed_amount', type: 'numeric', transformer: bigNumberTransformer })
    public guaranteedAmount!: BigNumber;
    @Column({ name: 'sender', type: 'varchar' })
    public sender!: string;
    @Column({ name: 'dst_receiver', type: 'varchar' })
    public dstReceiver!: string;
    @Column({ name: 'referrer', type: 'varchar' })
    public referrer!: string;
}
