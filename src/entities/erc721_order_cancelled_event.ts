import { bigNumberTransformer } from '../transformers';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'erc721_order_cancelled_events' })
export class Erc721OrderCancelledEvent extends Event {
    @Column({ name: 'maker', type: 'varchar' })
    public maker!: string;
    @Column({ name: 'nonce', type: 'numeric', transformer: bigNumberTransformer })
    public nonce!: BigNumber;
}
