import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers';

// These events come directly from the Exchange contract and are fired whenever
// someone fills an order.
@Entity({ name: 'uniswap_v3_swap_events' })
export class UniswapV3SwapEvent extends Event {
    // The address of the from token
    @Column({ name: 'sender', type: 'varchar' })
    public sender!: string;
    // The address of the to token
    @Column({ name: 'recipient', type: 'varchar' })
    public recipient!: string;
    // The amount of the from token that was transfered
    @Column({ name: 'amount0', type: 'numeric', transformer: bigNumberTransformer })
    public amount0!: BigNumber;
    // The amount of the to token that was transfered
    @Column({ name: 'amount1', type: 'numeric', transformer: bigNumberTransformer })
    public amount1!: BigNumber;
    @Column({ name: 'sqrtpricex96', type: 'numeric', transformer: bigNumberTransformer })
    public sqrtpricex96!: BigNumber;
    @Column({ name: 'liquidity', type: 'numeric', transformer: bigNumberTransformer })
    public liquidity!: BigNumber;
    @Column({ name: 'tick', type: 'integer' })
    public tick!: number;
}

// inputs: [
//     {
//         indexed: true,
//         internalType: 'address',
//         name: 'sender',
//         type: 'address',
//     },
//     {
//         indexed: true,
//         internalType: 'address',
//         name: 'recipient',
//         type: 'address',
//     },
//     {
//         indexed: false,
//         internalType: 'int256',
//         name: 'amount0',
//         type: 'int256',
//     },
//     {
//         indexed: false,
//         internalType: 'int256',
//         name: 'amount1',
//         type: 'int256',
//     },
//     {
//         indexed: false,
//         internalType: 'uint160',
//         name: 'sqrtPriceX96',
//         type: 'uint160',
//     },
//     {
//         indexed: false,
//         internalType: 'uint128',
//         name: 'liquidity',
//         type: 'uint128',
//     },
//     {
//         indexed: false,
//         internalType: 'int24',
//         name: 'tick',
//         type: 'int24',
//     },
// ],
