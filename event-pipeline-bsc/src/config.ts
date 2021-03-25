import { 
    DEFAULT_LOCAL_POSTGRES_URI,
    DEFAULT_START_BLOCK_OFFSET,
    DEFAULT_MAX_BLOCKS_TO_PULL,
    DEFAULT_MAX_BLOCKS_TO_SEARCH,
    DEFAULT_CHAIN_ID,
    DEFAULT_BLOCK_FINALITY_THRESHOLD,
    DEFAULT_SECONDS_BETWEEN_RUNS,
    DEFAULT_START_BLOCK_TIMESTAMP_OFFSET,
    DEFAULT_MAX_TIME_TO_SEARCH,
} from './constants';

const throwError = (err: string) => {
    throw new Error(err);
};

const supportedChains = [
    56 // BSC
];

// The earlier of the exchange or staking contract being created
const firstSearchBlockMap: { [chainId: number]: number } = {
    56: 5375047 // the block when EP was deployed on BSC // BSC
};

export const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL_BSC ? 
    process.env.ETHEREUM_RPC_URL_BSC : 
    throwError(`Must specify valid ETHEREUM_RPC_URL_BSC. Got: ${process.env.ETHEREUM_RPC_URL_BSC}`);
export const POSTGRES_URI = process.env.POSTGRES_URI || DEFAULT_LOCAL_POSTGRES_URI;
export const SHOULD_SYNCHRONIZE = process.env.SHOULD_SYNCHRONIZE === 'true';
export const START_BLOCK_OFFSET = process.env.START_BLOCK_OFFSET ? parseInt(process.env.START_BLOCK_OFFSET, 10) : DEFAULT_START_BLOCK_OFFSET;
export const MAX_BLOCKS_TO_PULL = process.env.MAX_BLOCKS_TO_PULL ? parseInt(process.env.MAX_BLOCKS_TO_PULL, 10) : DEFAULT_MAX_BLOCKS_TO_PULL;
export const MAX_BLOCKS_TO_SEARCH = process.env.MAX_BLOCKS_TO_SEARCH ? parseInt(process.env.MAX_BLOCKS_TO_SEARCH, 10) : DEFAULT_MAX_BLOCKS_TO_SEARCH;
export const CHAIN_ID = process.env.CHAIN_ID_BSC ? parseInt(process.env.CHAIN_ID_BSC, 10) : DEFAULT_CHAIN_ID;
if (!supportedChains.includes(CHAIN_ID)) {
    throwError(`Chain ID ${CHAIN_ID} is not supported. Please choose a valid Chain ID: ${supportedChains}`);
};
export const FIRST_SEARCH_BLOCK = firstSearchBlockMap[CHAIN_ID];
export const BLOCK_FINALITY_THRESHOLD = process.env.BLOCK_FINALITY_THRESHOLD ? parseInt(process.env.BLOCK_FINALITY_THRESHOLD, 10) : DEFAULT_BLOCK_FINALITY_THRESHOLD;
export const SECONDS_BETWEEN_RUNS = process.env.SECONDS_BETWEEN_RUNS ? parseInt(process.env.SECONDS_BETWEEN_RUNS, 10) : DEFAULT_SECONDS_BETWEEN_RUNS;
export const BRIDGEFILL_EVENT_TOPIC = ['0xe59e71a14fe90157eedc866c4f8c767d3943d6b6b2e8cd64dddcc92ab4c55af8'];
export const START_BLOCK_TIMESTAMP_OFFSET = process.env.START_BLOCK_TIMESTAMP_OFFSET ? parseInt(process.env.START_BLOCK_TIMESTAMP_OFFSET, 10) : DEFAULT_START_BLOCK_TIMESTAMP_OFFSET;
export const MAX_TIME_TO_SEARCH = process.env.MAX_TIME_TO_SEARCH ? parseInt(process.env.MAX_TIME_TO_SEARCH, 10) : DEFAULT_MAX_TIME_TO_SEARCH;
