import { numberToBigIntTransformer } from '../transformers';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'blocks' })
export class Block {
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
    @Column({ name: 'base_fee_per_gas', type: 'bigint', transformer: numberToBigIntTransformer })
    public baseFeePerGas!: number;
    @Column({ name: 'gas_used', type: 'bigint', transformer: numberToBigIntTransformer })
    public gasUsed!: number;
    @Column({ name: 'parent_hash', type: 'varchar' })
    public parentHash!: string;
}
