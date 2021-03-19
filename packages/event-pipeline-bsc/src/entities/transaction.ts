import { BigNumber } from '@0x/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { numberToBigIntTransformer, bigNumberTransformer } from '../utils';

// Transaction info for TX containing events
@Entity({ name: 'transactions', schema: 'events_bsc' })
export class Transaction {
    // When the event was scraped
    @Column({ name: 'observed_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    public observedTimestamp!: number;
    // hash of the transaction
    @PrimaryColumn({ name: 'transaction_hash', type: 'varchar' })
    public transactionHash!: string;
    //  the number of transactions made by the sender prior to this one.
    @Column({ name: 'nonce', type: 'bigint', transformer: numberToBigIntTransformer })
    public nonce!: number;
    // Hash of the block containing the TX
    @Column({ name: 'block_hash', type: 'varchar' })
    public blockHash!: string;
    // depth of the block
    @Column({ name: 'block_number', type: 'bigint', transformer: numberToBigIntTransformer })
    public blockNumber!: number;
    // integer of the transactions index position in the block. null when its pending.
    @Column({ name: 'transaction_index', type: 'bigint', transformer: numberToBigIntTransformer })
    public transactionIndex!: number;
    // address of the sender
    @Column({ name: 'sender_address', type: 'varchar' })
    public senderAddress!: string;
    // address of the receiver. null when its a contract creation transaction.
    @Column({ name: 'to_address', type: 'varchar', nullable: true })
    public toAddress!: string | null;
    // value transferred in Wei
    @Column({ name: 'value', type: 'numeric', transformer: bigNumberTransformer })
    public value!: BigNumber;
    // gas price provided by the sender in Wei
    @Column({ name: 'gas_price', type: 'numeric', transformer: bigNumberTransformer })
    public gasPrice!: BigNumber;
    //  gas provided by the sender
    @Column({ name: 'gas', type: 'numeric', transformer: bigNumberTransformer })
    public gas!: BigNumber;
    // the data send along with the transaction.
    @Column({ name: 'input', type: 'varchar' })
    public input!: string;
    // api affiliate
    @Column({ name: 'affiliate_address', type: 'varchar', nullable: true })
    public affiliateAddress!: string | null;
    // quote timestamp from affiliate data
    @Column({ name: 'quote_timestamp', type: 'bigint', transformer: numberToBigIntTransformer, nullable: true })
    public quoteTimestamp!: number | null;
    // quote ID from affiliate data
    @Column({ name: 'quote_id', type: 'varchar' })
    public quoteId!: string | null;
}
