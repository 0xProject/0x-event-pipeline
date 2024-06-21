import { bigNumberTransformer } from '../transformers';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

// These events come directly from the token's ERC20 contract and are fired whenever
// an ERC20 is transferred between two wallets.
@Entity({ name: 'rfq_order_events' })
export class RFQOrderEvent extends Event {
    @Column({ name: 'order_hash', type: 'varchar' })
    public orderHash!: string;
    @Column({ name: 'filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public filledAmount!: BigNumber;
}
