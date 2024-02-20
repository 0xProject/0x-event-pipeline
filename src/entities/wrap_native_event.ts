import { bigNumberTransformer } from '../transformers/big_number';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'wrap_native_events' })
export class WrapNativeEvent extends Event {
    @Column({ name: 'dst' })
    public dst!: string;
    @Column({ name: 'wad', type: 'bigint', transformer: bigNumberTransformer })
    public wad!: BigNumber;
}
