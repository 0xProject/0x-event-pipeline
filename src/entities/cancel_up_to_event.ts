import { bigNumberTransformer } from '../transformers/big_number';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

// These events come directly from the Exchange contract and are fired for meta transactions
@Entity({ name: 'cancel_up_to_events' })
export class CancelUpToEvent extends Event {
    // maker address of orders to cancel
    @Column({ name: 'maker_address', type: 'varchar' })
    public makerAddress!: string;
    // sender address of orders to cancel
    @Column({ name: 'sender_address', type: 'varchar' })
    public senderAddress!: string;
    // order epoch to cancel up to
    @Column({ name: 'order_epoch', type: 'numeric', transformer: bigNumberTransformer })
    public orderEpoch!: BigNumber;
}
