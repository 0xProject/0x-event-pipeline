import { Column, Entity, PrimaryColumn } from 'typeorm';

import { numberToBigIntTransformer } from '../utils';

// Table of the block number for which an event was last updated
@Entity({ name: 'last_block_processed', schema: 'events' })
export class LastBlockProcessed {
    // When the event was scraped
    @PrimaryColumn({ name: 'event_name', type: 'varchar' })
    public eventName!: string;
    // Block number last processed
    @Column({ name: 'last_processed_block_number', type: 'bigint', transformer: numberToBigIntTransformer, nullable: true })
    public lastProcessedBlockNumber!: number | null;
    // Block timestamp last processed--needed for Uniswap events from theGraph
    @Column({ name: 'last_processed_block_timestamp', type: 'bigint', transformer: numberToBigIntTransformer, nullable: true })
    public lastProcessedBlockTimestamp!: number| null;
    // timestamp this entry was updated
    @Column({ name: 'processed_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    public processedTimestamp!: number;
}
