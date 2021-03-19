export const DEFAULT_LOCAL_POSTGRES_URI = 'postgresql://user:password@localhost/events';
export const DEFAULT_START_BLOCK_OFFSET = 35;
export const DEFAULT_MAX_BLOCKS_TO_PULL = 100;
export const DEFAULT_MAX_BLOCKS_TO_SEARCH = 100;
export const DEFAULT_CHAIN_ID = 1;
export const DEFAULT_BLOCK_FINALITY_THRESHOLD = 0;
export const DEFAULT_SECONDS_BETWEEN_RUNS = 15;
export const DEFAULT_START_BLOCK_TIMESTAMP_OFFSET = 459;
export const DEFAULT_MAX_TIME_TO_SEARCH = 1310;
export const DEFAULT_SCRAPE_CANCEL_EVENTS_FLAG = false;
export const DEFAULT_SCRAPE_TRANSACTIONS_FLAG = false;
export const TRANSFORMEDERC20_EVENT_TOPIC = ['0x0f6672f78a59ba8e5e5b5d38df3ebc67f3c792e2c9259b8d97d7f00dd78ba1b3'];
export const LIQUIDITYPROVIDERSWAP_EVENT_TOPIC = ['0x40a6ba9513d09e3488135e0e0d10e2d4382b792720155b144cbea89ac9db6d34'];
export const RFQORDERFILLED_EVENT_TOPIC = ['0x829fa99d94dc4636925b38632e625736a614c154d55006b7ab6bea979c210c32'];
export const LIMITORDERFILLED_EVENT_TOPIC = ['0xab614d2b738543c0ea21f56347cf696a3a0c42a7cbec3212a5ca22a4dcff2124'];
export const V4_FILL_START_BLOCK = 11591021; // Native order feature deployment block
export const EXCHANGE_PROXY_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
export const EXCHANGE_PROXY_DEPLOYMENT_BLOCK = 10247094;
export const PLP_VIP_START_BLOCK = 11377457;
export const UNISWAPV2_SUBGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
export const SUSHISWAP_SUBGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork';
export const START_DIRECT_UNISWAP_SEARCH = 1600834642;
export const V4_CANCEL_START_BLOCK = 11674215; // first seen block - 1
export const V4_CANCEL_EVENT_TOPIC = ['0xa6eb7cdc219e1518ced964e9a34e61d68a94e4f1569db3e84256ba981ba52753'];
export const EXPIRED_RFQ_ORDER_EVENT_TOPIC = ['0xd9ee00a67daf7d99c37893015dc900862c9a02650ef2d318697e502e5fb8bbe2'];
export const MULTIPLEX_START_BLOCK = 12047508; // RANDOM BLOCK NUMBER FROM NOW FOR DATA PIPELINE TEST 

export const EXPIRED_RFQ_ORDER_ABI = {
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "bytes32",
            "name": "orderHash",
            "type": "bytes32"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "maker",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint64",
            "name": "expiry",
            "type": "uint64"
        }
    ],
    "name": "ExpiredRfqOrder",
    "type": "event"
};

export const V4_CANCEL_ABI = {
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "bytes32",
            "name": "orderHash",
            "type": "bytes32"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "maker",
            "type": "address"
        }
    ],
    "name": "OrderCancelled",
    "type": "event"
};

export const TRANSFORMED_ERC20_ABI = {
    "anonymous": false,
    "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "taker",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "inputToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "outputToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "inputTokenAmount",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "outputTokenAmount",
            "type": "uint256"
        }
    ],
    "name": "TransformedERC20",
    "type": "event"
};


export const BRIDGE_FILL_ABI = {
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "source",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "inputToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "outputToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "inputTokenAmount",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "outputTokenAmount",
            "type": "uint256"
        },
    ],
    "name": "BridgeFill",
    "type": "event"
};


export const LIQUIDITY_PROVIDER_SWAP_ABI = {

    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "address",
            "name": "inputToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "outputToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "inputTokenAmount",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "outputTokenAmount",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "provider",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "recipient",
            "type": "address"
        }
    ],
    "name": "LiquidityProviderSwap",
    "type": "event"
};

export const RFQ_ORDER_FILLED_ABI = {

    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "bytes32",
            "name": "orderHash",
            "type": "bytes32"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "maker",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "taker",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "makerToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "takerToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint128",
            "name": "takerTokenFilledAmount",
            "type": "uint128"
        },
        {
            "indexed": false,
            "internalType": "uint128",
            "name": "makerTokenFilledAmount",
            "type": "uint128"
        },
        {
            "indexed": false,
            "internalType": "bytes32",
            "name": "pool",
            "type": "bytes32"
        }
    ],
    "name": "RfqOrderFilled",
    "type": "event"
};

export const LIMIT_ORDER_FILLED_ABI = {

    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "bytes32",
            "name": "orderHash",
            "type": "bytes32"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "maker",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "taker",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "feeRecipient",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "makerToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "takerToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint128",
            "name": "takerTokenFilledAmount",
            "type": "uint128"
        },
        {
            "indexed": false,
            "internalType": "uint128",
            "name": "makerTokenFilledAmount",
            "type": "uint128"
        },
        {
            "indexed": false,
            "internalType": "uint128",
            "name": "takerTokenFeeFilledAmount",
            "type": "uint128"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "protocolFeePaid",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "bytes32",
            "name": "pool",
            "type": "bytes32"
        }
    ],
    "name": "LimitOrderFilled",
    "type": "event"
};

export const V3_FILL_ABI = {

    "anonymous": false,
    "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "makerAddress",
            "type": "address"
        },
        {
            "indexed": true,
            "internalType": "address",
            "name": "feeRecipientAddress",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "bytes",
            "name": "makerAssetData",
            "type": "bytes"
        },
        {
            "indexed": false,
            "internalType": "bytes",
            "name": "takerAssetData",
            "type": "bytes"
        },
        {
            "indexed": false,
            "internalType": "bytes",
            "name": "makerFeeAssetData",
            "type": "bytes"
        },
        {
            "indexed": false,
            "internalType": "bytes",
            "name": "takerFeeAssetData",
            "type": "bytes"
        },
        {
            "indexed": true,
            "internalType": "bytes32",
            "name": "orderHash",
            "type": "bytes32"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "takerAddress",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "senderAddress",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "makerAssetFilledAmount",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "takerAssetFilledAmount",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "makerFeePaid",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "takerFeePaid",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "protocolFeePaid",
            "type": "uint256"
        }
    ],
    "name": "Fill",
    "type": "event"
};
