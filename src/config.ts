import { 
    DEFAULT_LOCAL_POSTGRES_URI,
    DEFAULT_START_BLOCK_OFFSET,
    DEFAULT_MAX_BLOCKS_TO_PULL,
    DEFAULT_MAX_BLOCKS_TO_SEARCH,
    DEFAULT_CHAIN_ID,
    DEFAULT_BLOCK_FINALITY_THRESHOLD,
    DEFAULT_SECONDS_BETWEEN_RUNS,
    DEFAULT_STAKING_POOLS_JSON_URL,
    DEFAULT_STAKING_POOLS_METADATA_JSON_URL,
    DEFAULT_BASE_GITHUB_LOGO_URL,
} from './constants';

const throwError = (err: string) => {
    throw new Error(err);
};

const supportedChains = [
    1, // Mainnet
    3, // Ropsten
    4, // Rinkeby
    42, // Kovan
];

const stakingProxyDeploymentTxMap: { [chainId: number]: string } = {
    1: '0x4680e9d59bae9bbde1b0bae0fa5157ceea64ea923f2be434e5da6f5df2bdb907',
    3: '0x0596f07ef9787486c69784cdb9fca2431b5642131770e49a3c53f2f708a76e5b',
    4: '0x76e6b94d73e640548060be0ba02a578d4496144efb4601247a2342d14d30a3cc',
    42: '0x683501fe77223124cb5d284155825dd0df29edbb70cd9f7315580fade2f8d269',
};

// The earlier of the exchange or staking contract being created
const firstSearchBlockMap: { [chainId: number]: number } = {
    1: 8952139,
    3: 6659261,
    4: 5339071,
    42: 14425606,
};

export const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL ? 
    process.env.ETHEREUM_RPC_URL : 
    throwError(`Must specify valid ETHEREUM_RPC_URL. Got: ${process.env.ETHEREUM_RPC_URL}`);
export const POSTGRES_URI = process.env.POSTGRES_URI || DEFAULT_LOCAL_POSTGRES_URI;
export const SHOULD_SYNCHRONIZE = process.env.SHOULD_SYNCHRONIZE === 'true';
export const START_BLOCK_OFFSET = process.env.START_BLOCK_OFFSET ? parseInt(process.env.START_BLOCK_OFFSET, 10) : DEFAULT_START_BLOCK_OFFSET;
export const MAX_BLOCKS_TO_PULL = process.env.MAX_BLOCKS_TO_PULL ? parseInt(process.env.MAX_BLOCKS_TO_PULL, 10) : DEFAULT_MAX_BLOCKS_TO_PULL;
export const MAX_BLOCKS_TO_SEARCH = process.env.MAX_BLOCKS_TO_SEARCH ? parseInt(process.env.MAX_BLOCKS_TO_SEARCH, 10) : DEFAULT_MAX_BLOCKS_TO_SEARCH;
export const CHAIN_ID = process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID, 10) : DEFAULT_CHAIN_ID;
if (!supportedChains.includes(CHAIN_ID)) {
    throwError(`Chain ID ${CHAIN_ID} is not supported. Please choose a valid Chain ID: ${supportedChains}`);
};
export const FIRST_SEARCH_BLOCK = firstSearchBlockMap[CHAIN_ID];
export const STAKING_PROXY_DEPLOYMENT_TRANSACTION = stakingProxyDeploymentTxMap[CHAIN_ID];
export const BLOCK_FINALITY_THRESHOLD = process.env.BLOCK_FINALITY_THRESHOLD ? parseInt(process.env.BLOCK_FINALITY_THRESHOLD, 10) : DEFAULT_BLOCK_FINALITY_THRESHOLD;
export const SECONDS_BETWEEN_RUNS = process.env.SECONDS_BETWEEN_RUNS ? parseInt(process.env.SECONDS_BETWEEN_RUNS, 10) : DEFAULT_SECONDS_BETWEEN_RUNS;
export const STAKING_POOLS_JSON_URL = process.env.STAKING_POOLS_JSON_URL || DEFAULT_STAKING_POOLS_JSON_URL;
export const STAKING_POOLS_METADATA_JSON_URL = process.env.STAKING_POOLS_METADATA_JSON_URL || DEFAULT_STAKING_POOLS_METADATA_JSON_URL;
export const BASE_GITHUB_LOGO_URL = process.env.BASE_GITHUB_LOGO_URL || DEFAULT_BASE_GITHUB_LOGO_URL;
