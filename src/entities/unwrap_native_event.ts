import { bigNumberTransformer } from '../transformers/big_number';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'unwrap_native_events' })
export class UnwrapNativeEvent extends Event {
    @Column({ name: 'src' })
    public src!: string;
    @Column({ name: 'wad', type: 'bigint', transformer: bigNumberTransformer })
    public wad!: BigNumber;
}
