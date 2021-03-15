import { Column, PrimaryColumn } from 'typeorm';

import { numberToBigIntTransformer } from '../utils';

// Abstract class with common event fields
export abstract class Event {
    // When the event was scraped
    @Column({ name: 'observed_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    public observedTimestamp!: number;
    // The address of the smart contract where this event was fired.
    @Column({ name: 'contract_address' })
    public contractAddress!: string;
    // The hash of the transaction where this event occurred.
    @PrimaryColumn({ name: 'transaction_hash' })
    public transactionHash!: string;
    // integer of the transactions index position log was created from.
    @Column({ name: 'transaction_index', type: 'bigint', transformer: numberToBigIntTransformer })
    public transactionIndex!: number;
    // The index of the event log.
    @PrimaryColumn({ name: 'log_index' })
    public logIndex!: number;
    // The block hash where the event was fired.
    @Column({ name: 'block_hash', })
    public blockHash!: string;
    // The block number where the event occurred.
    @Column({ name: 'block_number', type: 'bigint', transformer: numberToBigIntTransformer })
    public blockNumber!: number;
}
