import { Column, Entity, PrimaryColumn } from 'typeorm';

import { numberToBigIntTransformer } from '../utils';

// Class for Uniswap Pairs
@Entity({ name: 'uniswap_pairs', schema: 'events' })
export class UniswapPair {
    // The address of the smart contract where this event was fired.
    @PrimaryColumn({ name: 'contract_address' })
    public contractAddress!: string;
    // The address of token0.
    @Column({ name: 'token0_address' })
    public token0!: string;
    // The address of token1.
    @Column({ name: 'token1_address' })
    public token1!: string;
     // The block number where the event occurred.
    @Column({ name: 'block_number', type: 'bigint', transformer: numberToBigIntTransformer })
    public blockNumber!: number;
}
