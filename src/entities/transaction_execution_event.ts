import { Column, Entity } from 'typeorm';

import { Event } from './event';

// These events come directly from the Exchange contract and are fired for meta transactions
@Entity({ name: 'transaction_execution_events', schema: 'events' })
export class TransactionExecutionEvent extends Event {
    // Hash of the ZeroEx Tx
    @Column({ name: 'zeroex_transaction_hash' })
    public zeroexTransactionHash!: string;
}
