import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers/big_number';

@Entity({ name: 'unwrap_eth_events' })
export class UnwrapETHEvent extends Event {
    @Column({ name: 'receiver_address' })
    public receiver_address!: string;
    @Column({ name: 'amount', type: 'bigint', transformer: bigNumberTransformer })
    public amount!: BigNumber;
}
