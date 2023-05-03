import { Column, Entity, PrimaryColumn } from 'typeorm';

// import { numberToBigIntTransformer } from '../transformers';

@Entity({ name: 'pools' })
export class Pool {
    // When the event was scraped
    // @Column({ name: 'observed_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    // public observedTimestamp!: number;
    @PrimaryColumn({ name: 'contract_address' })
    public contract_address!: string;
    @Column({ name: 'token0' })
    public token0!: string;
    @Column({ name: 'token1' })
    public token1!: string;
    @Column({ name: 'protocol_name' })
    public protocol_name!: string;
}
