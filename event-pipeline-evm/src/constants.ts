export const DEFAULT_LOCAL_POSTGRES_URI = 'postgresql://user:password@localhost/events';
export const DEFAULT_START_BLOCK_OFFSET = 35;
export const DEFAULT_MAX_BLOCKS_TO_PULL = 120;
export const DEFAULT_MAX_BLOCKS_TO_SEARCH = 120;
export const DEFAULT_BLOCK_FINALITY_THRESHOLD = 0;
export const DEFAULT_MINUTES_BETWEEN_RUNS = 3;
export const DEFAULT_START_BLOCK_TIMESTAMP_OFFSET = 105;
export const DEFAULT_MAX_TIME_TO_SEARCH = 360;
export const DEFAULT_SCRAPE_CANCEL_EVENTS_FLAG = false;
export const DEFAULT_SCRAPE_TRANSACTIONS_FLAG = false;
export const DEFAULT_FEAT_TRANSFORMED_ERC20_EVENT = true;
export const DEFAULT_FEAT_ONEINCH_SWAPPED_EVENT = false;
export const DEFAULT_FEAT_PANCAKE_VIP_EVENT = false;
export const TRANSFORMEDERC20_EVENT_TOPIC = ['0x0f6672f78a59ba8e5e5b5d38df3ebc67f3c792e2c9259b8d97d7f00dd78ba1b3'];
export const LIQUIDITYPROVIDERSWAP_EVENT_TOPIC = ['0x40a6ba9513d09e3488135e0e0d10e2d4382b792720155b144cbea89ac9db6d34'];
export const RFQORDERFILLED_EVENT_TOPIC = ['0x829fa99d94dc4636925b38632e625736a614c154d55006b7ab6bea979c210c32'];
export const LIMITORDERFILLED_EVENT_TOPIC = ['0xab614d2b738543c0ea21f56347cf696a3a0c42a7cbec3212a5ca22a4dcff2124'];
export const EXCHANGE_PROXY_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
export const V4_CANCEL_EVENT_TOPIC = ['0xa6eb7cdc219e1518ced964e9a34e61d68a94e4f1569db3e84256ba981ba52753'];
export const EXPIRED_RFQ_ORDER_EVENT_TOPIC = ['0xd9ee00a67daf7d99c37893015dc900862c9a02650ef2d318697e502e5fb8bbe2'];
export const SWAP_EVENT_TOPIC = [
    '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
    '0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff',
];
export const ONEINCH_ROUTER_V3_CONTRACT_ADDRESS = '0x11111112542D85B3EF69AE05771c2dCCff4fAa26';
export const ONEINCH_SWAPPED_EVENT_TOPIC = ['0xd6d4f5681c246c9f42c203e287975af1601f8df8035a9251f79aab5c8f09e2f8'];

export {
    EXPIRED_RFQ_ORDER_ABI,
    LIMIT_ORDER_FILLED_ABI,
    LIQUIDITY_PROVIDER_SWAP_ABI,
    RFQ_ORDER_FILLED_ABI,
    TRANSFORMED_ERC20_ABI,
    V4_CANCEL_ABI,
} from '@0x/pipeline-utils';

export const SWAP_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount0In',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount1In',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount0Out',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount1Out',
            type: 'uint256',
        },
        {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
        },
    ],
    name: 'Swap',
    type: 'event',
};

export const BRIDGE_FILL_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'bytes32',
            name: 'source',
            type: 'bytes32',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'inputToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'outputToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'inputTokenAmount',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'outputTokenAmount',
            type: 'uint256',
        },
    ],
    name: 'BridgeFill',
    type: 'event',
};

export const ONEINCH_SWAPPED_ABI = {
    anonymous: false,
    inputs: [
        { indexed: false, internalType: 'address', name: 'sender', type: 'address' },
        { indexed: false, internalType: 'contract IERC20', name: 'srcToken', type: 'address' },
        { indexed: false, internalType: 'contract IERC20', name: 'dstToken', type: 'address' },
        { indexed: false, internalType: 'address', name: 'dstReceiver', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'spentAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    name: 'Swapped',
    type: 'event',
};
