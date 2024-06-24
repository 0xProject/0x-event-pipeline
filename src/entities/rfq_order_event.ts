import { bigNumberTransformer } from '../transformers';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

// These events are emitted by the Settler contract whenever an RFQ order is filled.
// They are not ABI compliant.
@Entity({ name: 'rfq_order_events' })
export class RFQOrderEvent extends Event {
    @Column({ name: 'order_hash', type: 'varchar' })
    public orderHash!: string;
    @Column({ name: 'filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public filledAmount!: BigNumber;
}
