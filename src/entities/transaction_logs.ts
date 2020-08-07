import { Column, Entity, PrimaryColumn } from 'typeorm';

import { numberToBigIntTransformer } from '../utils';

// Transaction Receipt Logs for storage
@Entity({ name: 'transaction_logs', schema: 'events' })
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
}
