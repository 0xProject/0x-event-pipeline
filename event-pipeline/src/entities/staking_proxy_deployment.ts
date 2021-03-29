import { Column, Entity, PrimaryColumn } from 'typeorm';

import { numberToBigIntTransformer } from '@0x/pipeline-utils';

// Entity for when the staking proxy contract was deployed
// Marks the beginning of Epoch 1
@Entity({ name: 'staking_proxy_deployment', schema: 'events' })
export class StakingProxyDeployment {
    // When the deploy was scraped
    @Column({ name: 'observed_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    public observedTimestamp!: number;
    // The hash of the transaction when deployment occurred.
    @PrimaryColumn({ name: 'transaction_hash' })
    public transactionHash!: string;
    // integer of the transaction's postiion in the block
    @Column({ name: 'transaction_index', type: 'bigint', transformer: numberToBigIntTransformer })
    public transactionIndex!: number;
    // The hash of the block where the transaction occurred
    @Column({ name: 'block_hash', type: 'varchar' })
    public blockHash!: string;
    // The number of the block where the transaction occurred
    @Column({ name: 'block_number', type: 'bigint', transformer: numberToBigIntTransformer })
    public blockNumber!: number;
    // The timestamp of the block where the transaction occurred
    @Column({ name: 'block_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    public blockTimestamp!: number;
}
