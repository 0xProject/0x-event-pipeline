import { Column, Entity, PrimaryColumn } from 'typeorm';

import { numberToBigIntTransformer } from '../utils';

// These events come directly from the Exchange contract and are fired whenever
// someone fills an order.
@Entity({ name: 'blocks', schema: 'events' })
export class Block {
    // When the event was scraped
    @Column({ name: 'observed_timestamp', transformer: numberToBigIntTransformer })
    public observedTimestamp!: number;
    // Hash of the block
    @PrimaryColumn({ name: 'block_hash' })
    public blockHash!: string;
    // depth of the block
    @PrimaryColumn({ name: 'block_number', transformer: numberToBigIntTransformer })
    public blockNumber!: number;
    // collation time of the block
    @Column({ name: 'block_timestamp', transformer: numberToBigIntTransformer })
    public blockTimestamp!: number;
}
