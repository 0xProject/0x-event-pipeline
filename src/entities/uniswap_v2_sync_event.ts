import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers';

// These events come directly from the Exchange contract and are fired whenever
// someone fills an order.
@Entity({ name: 'uniswap_v2_sync_events' })
export class UniswapV2SyncEvent extends Event {
    // The reseres of token0
    @Column({ name: 'reserve0', type: 'numeric', transformer: bigNumberTransformer })
    public reserve0!: BigNumber;
    // The reseres of token1
    @Column({ name: 'reserve1', type: 'numeric', transformer: bigNumberTransformer })
    public reserve1!: BigNumber;
}
