"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.PARASWAP_SWAPPED_ABI = exports.SLINGSHOT_TRADE_ABI = exports.ONEINCH_SWAPPED_ABI = exports.BRIDGE_FILL_ABI = exports.SWAP_ABI = exports.V4_CANCEL_ABI = exports.TRANSFORMED_ERC20_ABI = exports.RFQ_ORDER_FILLED_ABI = exports.LIQUIDITY_PROVIDER_SWAP_ABI = exports.LIMIT_ORDER_FILLED_ABI = exports.EXPIRED_RFQ_ORDER_ABI = exports.PARASWAP_SWAPPED_EVENT_TOPIC = exports.SLINGSHOT_TRADE_EVENT_TOPIC = exports.SLINGSHOT_CONTRACT_ADDRESS = exports.ONEINCH_SWAPPED_EVENT_TOPIC = exports.ONEINCH_ROUTER_V3_CONTRACT_ADDRESS = exports.SWAP_EVENT_TOPIC = exports.EXPIRED_RFQ_ORDER_EVENT_TOPIC = exports.V4_CANCEL_EVENT_TOPIC = exports.EXCHANGE_PROXY_ADDRESS = exports.LIMITORDERFILLED_EVENT_TOPIC = exports.RFQORDERFILLED_EVENT_TOPIC = exports.LIQUIDITYPROVIDERSWAP_EVENT_TOPIC = exports.TRANSFORMEDERC20_EVENT_TOPIC = exports.DEFAULT_FEAT_PARASWAP_SWAPPED_EVENT = exports.DEFAULT_FEAT_SLINGSHOT_TRADE_EVENT = exports.DEFAULT_FEAT_VIP_SWAP_EVENT = exports.DEFAULT_FEAT_ONEINCH_SWAPPED_EVENT = exports.DEFAULT_FEAT_TRANSFORMED_ERC20_EVENT = exports.DEFAULT_SCRAPE_TRANSACTIONS_FLAG = exports.DEFAULT_SCRAPE_CANCEL_EVENTS_FLAG = exports.DEFAULT_MAX_TIME_TO_SEARCH = exports.DEFAULT_START_BLOCK_TIMESTAMP_OFFSET = exports.DEFAULT_MINUTES_BETWEEN_RUNS = exports.DEFAULT_BLOCK_FINALITY_THRESHOLD = exports.DEFAULT_MAX_BLOCKS_TO_SEARCH = exports.DEFAULT_MAX_BLOCKS_TO_PULL = exports.DEFAULT_START_BLOCK_OFFSET = exports.DEFAULT_LOCAL_POSTGRES_URI = void 0;
exports.DEFAULT_LOCAL_POSTGRES_URI = 'postgresql://user:password@localhost/events';
exports.DEFAULT_START_BLOCK_OFFSET = 35;
exports.DEFAULT_MAX_BLOCKS_TO_PULL = 120;
exports.DEFAULT_MAX_BLOCKS_TO_SEARCH = 120;
exports.DEFAULT_BLOCK_FINALITY_THRESHOLD = 0;
exports.DEFAULT_MINUTES_BETWEEN_RUNS = 3;
exports.DEFAULT_START_BLOCK_TIMESTAMP_OFFSET = 105;
exports.DEFAULT_MAX_TIME_TO_SEARCH = 360;
exports.DEFAULT_SCRAPE_CANCEL_EVENTS_FLAG = false;
exports.DEFAULT_SCRAPE_TRANSACTIONS_FLAG = false;
exports.DEFAULT_FEAT_TRANSFORMED_ERC20_EVENT = true;
exports.DEFAULT_FEAT_ONEINCH_SWAPPED_EVENT = false;
exports.DEFAULT_FEAT_VIP_SWAP_EVENT = false;
exports.DEFAULT_FEAT_SLINGSHOT_TRADE_EVENT = false;
exports.DEFAULT_FEAT_PARASWAP_SWAPPED_EVENT = false;
exports.TRANSFORMEDERC20_EVENT_TOPIC = ['0x0f6672f78a59ba8e5e5b5d38df3ebc67f3c792e2c9259b8d97d7f00dd78ba1b3'];
exports.LIQUIDITYPROVIDERSWAP_EVENT_TOPIC = ['0x40a6ba9513d09e3488135e0e0d10e2d4382b792720155b144cbea89ac9db6d34'];
exports.RFQORDERFILLED_EVENT_TOPIC = ['0x829fa99d94dc4636925b38632e625736a614c154d55006b7ab6bea979c210c32'];
exports.LIMITORDERFILLED_EVENT_TOPIC = ['0xab614d2b738543c0ea21f56347cf696a3a0c42a7cbec3212a5ca22a4dcff2124'];
exports.EXCHANGE_PROXY_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
exports.V4_CANCEL_EVENT_TOPIC = ['0xa6eb7cdc219e1518ced964e9a34e61d68a94e4f1569db3e84256ba981ba52753'];
exports.EXPIRED_RFQ_ORDER_EVENT_TOPIC = ['0xd9ee00a67daf7d99c37893015dc900862c9a02650ef2d318697e502e5fb8bbe2'];
exports.SWAP_EVENT_TOPIC = [
    '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
    '0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff',
];
exports.ONEINCH_ROUTER_V3_CONTRACT_ADDRESS = '0x11111112542D85B3EF69AE05771c2dCCff4fAa26';
exports.ONEINCH_SWAPPED_EVENT_TOPIC = ['0xd6d4f5681c246c9f42c203e287975af1601f8df8035a9251f79aab5c8f09e2f8'];
exports.SLINGSHOT_CONTRACT_ADDRESS = '0xF2e4209afA4C3c9eaA3Fb8e12eeD25D8f328171C';
exports.SLINGSHOT_TRADE_EVENT_TOPIC = ['0xd0c707b5ea7a686e3488bec166c1433616af06ab4ffa10e059b6da789bff90ac'];
exports.PARASWAP_SWAPPED_EVENT_TOPIC = ['0x9cc2048b8af5eadff75759a3169b369efc538fb79c760fd396a4b355410b41b7'];
var pipeline_utils_1 = require("@0x/pipeline-utils");
__createBinding(exports, pipeline_utils_1, "EXPIRED_RFQ_ORDER_ABI");
__createBinding(exports, pipeline_utils_1, "LIMIT_ORDER_FILLED_ABI");
__createBinding(exports, pipeline_utils_1, "LIQUIDITY_PROVIDER_SWAP_ABI");
__createBinding(exports, pipeline_utils_1, "RFQ_ORDER_FILLED_ABI");
__createBinding(exports, pipeline_utils_1, "TRANSFORMED_ERC20_ABI");
__createBinding(exports, pipeline_utils_1, "V4_CANCEL_ABI");
exports.SWAP_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address'
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount0In',
            type: 'uint256'
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount1In',
            type: 'uint256'
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount0Out',
            type: 'uint256'
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount1Out',
            type: 'uint256'
        },
        {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address'
        },
    ],
    name: 'Swap',
    type: 'event'
};
exports.BRIDGE_FILL_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'bytes32',
            name: 'source',
            type: 'bytes32'
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'inputToken',
            type: 'address'
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'outputToken',
            type: 'address'
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'inputTokenAmount',
            type: 'uint256'
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'outputTokenAmount',
            type: 'uint256'
        },
    ],
    name: 'BridgeFill',
    type: 'event'
};
exports.ONEINCH_SWAPPED_ABI = {
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
    type: 'event'
};
// https://github.com/code-423n4/2021-02-slingshot/blob/main/contracts/Slingshot.sol
exports.SLINGSHOT_TRADE_ABI = {
    anonymous: false,
    inputs: [
        { indexed: true, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'address', name: 'fromToken', type: 'address' },
        { indexed: false, internalType: 'address', name: 'toToken', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'fromAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'toAmount', type: 'uint256' },
        { indexed: false, internalType: 'address', name: 'recipient', type: 'address' },
    ],
    name: 'Trade',
    type: 'event'
};
exports.PARASWAP_SWAPPED_ABI = {
    anonymous: false,
    inputs: [
        { indexed: false, internalType: 'address', name: 'initiator', type: 'address' },
        { indexed: true, internalType: 'address', name: 'beneficiary', type: 'address' },
        { indexed: true, internalType: 'address', name: 'srcToken', type: 'address' },
        { indexed: true, internalType: 'address', name: 'destToken', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'srcAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'receivedAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'expectedAmount', type: 'uint256' },
        { indexed: false, internalType: 'string', name: 'referrer', type: 'string' },
    ],
    name: 'Swapped',
    type: 'event'
};
