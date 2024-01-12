import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers';

// THis event is not save to the DB, just used to detect new tokens
@Entity({ name: 'none' })
export class TokenTransferEvent extends Event {
    @Column({ name: 'from', type: 'varchar' })
    public from!: string;
    @Column({ name: 'to', type: 'varchar' })
    public to!: string;
    @Column({ name: 'value', type: 'numeric', transformer: bigNumberTransformer })
    public value!: BigNumber;
}
