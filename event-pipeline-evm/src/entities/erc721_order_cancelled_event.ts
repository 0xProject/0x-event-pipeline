import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers';

@Entity({ name: 'erc721_order_cancelled_events' })
export class Erc721OrderCancelledEvent extends Event {
    @Column({ name: 'maker', type: 'varchar' })
    public maker!: string;
    @Column({ name: 'nonce', type: 'numeric', transformer: bigNumberTransformer })
    public nonce!: BigNumber;
}
