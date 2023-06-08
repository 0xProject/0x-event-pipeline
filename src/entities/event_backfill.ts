import { Column, Entity, PrimaryColumn } from 'typeorm';

import { numberToBigIntTransformer } from '../transformers';

@Entity({ name: 'events_backfill' })
export class EventBackfill {
    // Name of the event to Backfill
    @PrimaryColumn({ name: 'name', type: 'varchar' })
    public name!: string;
    // depth of the block
    @PrimaryColumn({ name: 'block_number', type: 'bigint', transformer: numberToBigIntTransformer })
    public blockNumber!: number;
}
