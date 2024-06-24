import { bigNumberTransformer } from '../transformers';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

// These events come directly from the token's ERC20 contract and are fired whenever
// an ERC20 is transferred between two wallets.
@Entity({ name: 'erc20_transfer_events' })
export class ERC20TransferEvent extends Event {
    @Column({ name: 'from', type: 'varchar' })
    public from!: string;
    @Column({ name: 'to', type: 'varchar' })
    public to!: string | null;
    @Column({ name: 'value', type: 'numeric', transformer: bigNumberTransformer })
    public value!: BigNumber;
}
