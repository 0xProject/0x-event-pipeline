import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers';

// These events come directly from the Exchange contract and are fired whenever
// someone fills an order.
@Entity({ name: 'uniswap_v2_pair_created_events' })
export class UniswapV2PairCreatedEvent extends Event {
    // The address of token0
    @Column({ name: 'token0', type: 'varchar' })
    public token0!: string;
    // The address of token1
    @Column({ name: 'token1', type: 'varchar' })
    public token1!: string;
    // The address of the pair
    @Column({ name: 'pair', type: 'varchar' })
    public pair!: string;
    // The counter of the pair for all the pairs created by this pair factory
    @Column({ name: 'pair_factory_counter', type: 'numeric', transformer: bigNumberTransformer })
    public pairFactoryCounter!: BigNumber;
    // The name of the protocol
    @Column({ name: 'protocol', type: 'varchar' })
    public protocol!: string;
}
