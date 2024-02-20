import { bigNumberTransformer } from '../transformers';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

// These events come directly from the Exchange contract and are fired for meta transactions
@Entity({ name: 'expired_rfq_order_events' })
export class ExpiredRfqOrderEvent extends Event {
    // The hash of the order that was cancelled.
    @Column({ name: 'order_hash', type: 'varchar' })
    public orderHash!: string;
    // The address of the maker.
    @Column({ name: 'maker', type: 'varchar' })
    public maker!: string;

    @Column({ name: 'expiry', type: 'numeric', transformer: bigNumberTransformer })
    public expiry!: BigNumber;
}
