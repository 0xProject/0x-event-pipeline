import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers/big_number';

@Entity({ name: 'wrap_eth_events' })
export class WrapETHEvent extends Event {
    @Column({ name: 'sender_address' })
    public sender_address!: string;
    @Column({ name: 'amount', type: 'bigint', transformer: bigNumberTransformer })
    public amount!: BigNumber;
}
