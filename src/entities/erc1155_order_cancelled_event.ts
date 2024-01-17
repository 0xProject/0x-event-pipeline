import { Event } from './event';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'erc1155_order_cancelled_events' })
export class Erc1155OrderCancelledEvent extends Event {
    @Column({ name: 'order_hash', type: 'varchar' })
    public orderHash!: string;
    @Column({ name: 'maker', type: 'varchar' })
    public maker!: string;
}
