export const DEFAULT_LOCAL_POSTGRES_URI = 'postgresql://user:password@localhost/events';
export const DEFAULT_START_BLOCK_OFFSET = 35;
export const DEFAULT_MAX_BLOCKS_TO_PULL = 100;
export const DEFAULT_MAX_BLOCKS_TO_SEARCH = 100;
export const DEFAULT_CHAIN_ID = 1;
export const DEFAULT_BLOCK_FINALITY_THRESHOLD = 0;
export const DEFAULT_SECONDS_BETWEEN_RUNS = 15;
export const DEFAULT_STAKING_POOLS_JSON_URL = 'https://raw.githubusercontent.com/0xProject/0x-staking-pool-registry/master/staking_pools.json';
export const DEFAULT_STAKING_POOLS_METADATA_JSON_URL = 'https://raw.githubusercontent.com/0xProject/0x-staking-pool-registry/master/pool_metadata.json';
export const DEFAULT_BASE_GITHUB_LOGO_URL = 'https://github.com/0xProject/0x-staking-pool-registry/raw/master/logos/';
export const DEFAULT_START_BLOCK_TIMESTAMP_OFFSET = 459;
export const DEFAULT_MAX_TIME_TO_SEARCH = 1310;
export const TRANSFORMEDERC20_EVENT_TOPIC = ['0x0f6672f78a59ba8e5e5b5d38df3ebc67f3c792e2c9259b8d97d7f00dd78ba1b3'];
export const EXCHANGE_PROXY_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
export const EXCHANGE_PROXY_DEPLOYMENT_BLOCK = 10247094;
export const UNISWAPV2_SUBGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
export const SUSHISWAP_SUBGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork';
export const START_DIRECT_UNISWAP_SEARCH = 1600834642;

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

export const ERC20_BRIDGE_TRADE_ABI = {
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "address",
            "name": "fromToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "toToken",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "fromTokenAmount",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "toTokenAmount",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "from",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "to",
            "type": "address"
        }
    ],
    "name": "ERC20BridgeTransfer",
    "type": "event"
};
