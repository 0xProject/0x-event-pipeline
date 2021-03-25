import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../utils';

// These events come directly from the Exchange contract and are fired whenever
// someone fills an order.
@Entity({ name: 'erc20_bridge_transfer_events', schema: 'events_bsc' })
export class ERC20BridgeTransferEvent extends Event {
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
    @Column({ name: 'direct_flag', type: 'boolean', nullable: true })
    public directFlag!: boolean | null;
    @Column({ name: 'direct_protocol', type: 'varchar', nullable: true })
    public directProtocol!: string | null;
}
