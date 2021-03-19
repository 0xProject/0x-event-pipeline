import { Column, Entity } from 'typeorm';
import { BigNumber } from '@0x/utils';

import { Event } from './event';
import { bigNumberTransformer } from '../utils';


// These events come directly from the Exchange contract and are fired for meta transactions
@Entity({ name: 'expired_rfq_order_events', schema: 'events_bsc' })
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
