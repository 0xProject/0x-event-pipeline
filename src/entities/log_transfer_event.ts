import { bigNumberTransformer } from '../transformers/big_number';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

// These events come directly from the Exchange contract and are fired whenever
// someone fills an order.
@Entity({ name: 'log_transfer_events' })
export class LogTransferEvent extends Event {
    @Column({ name: 'token' })
    public token!: string;
    @Column({ name: 'from' })
    public from!: string;
    @Column({ name: 'to' })
    public to!: string;
    @Column({ name: 'amount', type: 'numeric', transformer: bigNumberTransformer })
    public amount!: BigNumber;
    @Column({ name: 'input1', type: 'numeric', transformer: bigNumberTransformer })
    public input1!: BigNumber;
    @Column({ name: 'input2', type: 'numeric', transformer: bigNumberTransformer })
    public input2!: BigNumber;
    @Column({ name: 'output1', type: 'numeric', transformer: bigNumberTransformer })
    public output1!: BigNumber;
    @Column({ name: 'output2', type: 'numeric', transformer: bigNumberTransformer })
    public output2!: BigNumber;
}
