import { numberToBigIntTransformer } from '../transformers';
import { Column, Entity, PrimaryColumn } from 'typeorm';

// Transaction Receipt Logs for storage
@Entity({ name: 'transaction_logs' })
export class TransactionLogs {
    // When the event was scraped
    @Column({ name: 'observed_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    public observedTimestamp!: number;
    // hash of the transaction
    @PrimaryColumn({ name: 'transaction_hash', type: 'varchar' })
    public transactionHash!: string;
    // Logs from the transaction receipt
    @Column({ name: 'logs', type: 'varchar' })
    public logs!: string;
    // Hash of the block containing the TX
    @Column({ name: 'block_hash', type: 'varchar' })
    public blockHash!: string;
    // depth of the block
    @Column({ name: 'block_number', type: 'bigint', transformer: numberToBigIntTransformer })
    public blockNumber!: number;
    @Column({ name: 'chain_id', type: 'varchar' })
    public chainId!: string;
}
