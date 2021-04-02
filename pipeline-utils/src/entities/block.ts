import { Column, PrimaryColumn } from 'typeorm';

import { numberToBigIntTransformer } from '../transformers';

export abstract class Block {
    // When the event was scraped
    @Column({ name: 'observed_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    public observedTimestamp!: number;
    // Hash of the block
    @PrimaryColumn({ name: 'block_hash', type: 'varchar' })
    public blockHash!: string;
    // depth of the block
    @PrimaryColumn({ name: 'block_number', type: 'bigint', transformer: numberToBigIntTransformer })
    public blockNumber!: number;
    // collation time of the block
    @Column({ name: 'block_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    public blockTimestamp!: number;
}
