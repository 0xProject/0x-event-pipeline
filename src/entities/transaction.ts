import { Column, Entity, PrimaryColumn } from 'typeorm';

import { bigNumberTransformer, numberToBigIntTransformer } from '../utils';
import { BigNumber } from '@0x/utils';

// Ethereum transaction info from events
@Entity({ name: 'transactions', schema: 'events' })
export class Transaction {
    // When the event was scraped
    @Column({ name: 'observed_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    public observedTimestamp!: number;
    // The address of the taker (may be null).
    @PrimaryColumn({ name: 'transaction_hash' })
    public transactionHash!: string;
    // Hash of the block
    @PrimaryColumn({ name: 'block_hash' })
    public blockHash!: string;
    // depth of the block
    @PrimaryColumn({ name: 'block_number', type: 'bigint', transformer: numberToBigIntTransformer })
    public blockNumber!: number;
    // Index of the transaction in the block
    @Column({ name: 'transaction_index', type: 'bigint', transformer: numberToBigIntTransformer })
    public transactionIndex!: number;
    // The address of the sender
    @Column({ name: 'sender_address' })
    public sender!: string;
    // Price of gas in wei
    @Column({ name: 'gas_price', type: 'numeric', transformer: bigNumberTransformer })
    public gasPrice!: BigNumber;
    // Gas used mining the transaction
    @Column({ name: 'gas_used', type: 'numeric', transformer: bigNumberTransformer })
    public gasUsed!: BigNumber;
    // Gas used mining the transaction
    @Column({ name: 'input' })
    public input!: string;
}
