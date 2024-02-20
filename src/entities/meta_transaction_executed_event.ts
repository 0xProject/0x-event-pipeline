import { bigNumberTransformer } from '../transformers';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'meta_transaction_executed_events' })
export class MetaTransactionExecutedEvent extends Event {
    // The meta-transaction hash
    @Column({ name: 'hash', type: 'varchar' })
    public hash!: string;
    // The selector of the function being executed
    @Column({ name: 'selector', type: 'varchar' })
    public selector!: string;
    // Who to execute the meta-transaction on behalf of
    @Column({ name: 'signer', type: 'varchar' })
    public signer!: string;
    // Who executed the meta-transaction
    @Column({ name: 'sender', type: 'varchar' })
    public sender!: string;
}
