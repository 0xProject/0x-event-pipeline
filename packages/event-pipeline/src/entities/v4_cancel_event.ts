import { Column, Entity } from 'typeorm';

import { Event } from './event';

// These events come directly from the Exchange contract and are fired for meta transactions
@Entity({ name: 'v4_cancel_events', schema: 'events' })
export class V4CancelEvent extends Event {
    // The address of the maker.
    @Column({ name: 'maker', type: 'varchar' })
    public maker!: string;
    // The hash of the order that was cancelled.
    @Column({ name: 'order_hash', type: 'varchar' })
    public orderHash!: string;
}
