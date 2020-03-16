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
