import { BigNumber } from '@0x/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { numberToBigIntTransformer, bigNumberTransformer } from '../utils';

// Transaction Receipt info for TX containing events
@Entity({ name: 'transaction_receipts', schema: 'events_bsc' })
export class TransactionReceipt {
    // When the event was scraped
    @Column({ name: 'observed_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    public observedTimestamp!: number;
    // hash of the transaction
    @PrimaryColumn({ name: 'transaction_hash', type: 'varchar' })
    public transactionHash!: string;
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
    // Amount of gas consumed by the tx
    @Column({ name: 'gas_used', type: 'numeric', transformer: bigNumberTransformer })
    public gasUsed!: BigNumber;
}
