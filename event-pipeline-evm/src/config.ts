import {
    DEFAULT_LOCAL_POSTGRES_URI,
    DEFAULT_START_BLOCK_OFFSET,
    DEFAULT_MAX_BLOCKS_TO_PULL,
    DEFAULT_MAX_BLOCKS_TO_SEARCH,
    DEFAULT_BLOCK_FINALITY_THRESHOLD,
    DEFAULT_MINUTES_BETWEEN_RUNS,
    DEFAULT_START_BLOCK_TIMESTAMP_OFFSET,
    DEFAULT_MAX_TIME_TO_SEARCH,
    DEFAULT_FEAT_TRANSFORMED_ERC20_EVENT,
    DEFAULT_FEAT_ONEINCH_SWAPPED_EVENT,
    DEFAULT_FEAT_PANCAKE_VIP_EVENT,
} from './constants';

const throwError = (err: string) => {
    throw new Error(err);
};

const supportedChains = [
    56, // BSC
    137, // Polygon
];

export const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL
    ? process.env.ETHEREUM_RPC_URL
    : throwError(`Must specify valid ETHEREUM_RPC_URL. Got: ${process.env.ETHEREUM_RPC_URL}`);
export const EP_DEPLOYMENT_BLOCK = process.env.EP_DEPLOYMENT_BLOCK
    ? parseInt(process.env.EP_DEPLOYMENT_BLOCK, 10)
    : throwError(`Must specify valid EP_DEPLOYMENT_BLOCK. Got: ${process.env.EP_DEPLOYMENT_BLOCK}`);
export const SCHEMA = process.env.SCHEMA
    ? process.env.SCHEMA
    : throwError(`Must specify valid SCHEMA. Got: ${process.env.SCHEMA}`);
export const POSTGRES_URI = process.env.POSTGRES_URI || DEFAULT_LOCAL_POSTGRES_URI;
export const SHOULD_SYNCHRONIZE = process.env.SHOULD_SYNCHRONIZE === 'true';
export const START_BLOCK_OFFSET = process.env.START_BLOCK_OFFSET
    ? parseInt(process.env.START_BLOCK_OFFSET, 10)
    : DEFAULT_START_BLOCK_OFFSET;
export const MAX_BLOCKS_TO_PULL = process.env.MAX_BLOCKS_TO_PULL
    ? parseInt(process.env.MAX_BLOCKS_TO_PULL, 10)
    : DEFAULT_MAX_BLOCKS_TO_PULL;
export const MAX_BLOCKS_TO_SEARCH = process.env.MAX_BLOCKS_TO_SEARCH
    ? parseInt(process.env.MAX_BLOCKS_TO_SEARCH, 10)
    : DEFAULT_MAX_BLOCKS_TO_SEARCH;
export const CHAIN_ID = process.env.CHAIN_ID
    ? parseInt(process.env.CHAIN_ID, 10)
    : throwError(`Must specify valid CHAIN_ID. Got: ${process.env.CHAIN_ID}`);
if (!supportedChains.includes(CHAIN_ID)) {
    throwError(`Chain ID ${CHAIN_ID} is not supported. Please choose a valid Chain ID: ${supportedChains}`);
}
export const BLOCK_FINALITY_THRESHOLD = process.env.BLOCK_FINALITY_THRESHOLD
    ? parseInt(process.env.BLOCK_FINALITY_THRESHOLD, 10)
    : DEFAULT_BLOCK_FINALITY_THRESHOLD;
export const MINUTES_BETWEEN_RUNS = process.env.MINUTES_BETWEEN_RUNS
    ? parseInt(process.env.MINUTES_BETWEEN_RUNS, 10)
    : DEFAULT_MINUTES_BETWEEN_RUNS;
export const BRIDGEFILL_EVENT_TOPIC = ['0xe59e71a14fe90157eedc866c4f8c767d3943d6b6b2e8cd64dddcc92ab4c55af8'];
export const START_BLOCK_TIMESTAMP_OFFSET = process.env.START_BLOCK_TIMESTAMP_OFFSET
    ? parseInt(process.env.START_BLOCK_TIMESTAMP_OFFSET, 10)
    : DEFAULT_START_BLOCK_TIMESTAMP_OFFSET;
export const MAX_TIME_TO_SEARCH = process.env.MAX_TIME_TO_SEARCH
    ? parseInt(process.env.MAX_TIME_TO_SEARCH, 10)
    : DEFAULT_MAX_TIME_TO_SEARCH;
export const STAKING_DEPLOYMENT_BLOCK = process.env.STAKING_DEPLOYMENT_BLOCK
    ? parseInt(process.env.STAKING_DEPLOYMENT_BLOCK, 10)
    : null;
export const FIRST_SEARCH_BLOCK = Math.min(EP_DEPLOYMENT_BLOCK, STAKING_DEPLOYMENT_BLOCK || Infinity);

export const FEAT_TRANSFORMED_ERC20_EVENT = process.env.hasOwnProperty('FEAT_TRANSFORMED_ERC20_EVENT')
    ? process.env.FEAT_TRANSFORMED_ERC20_EVENT === 'true'
    : DEFAULT_FEAT_TRANSFORMED_ERC20_EVENT;
export const FEAT_ONEINCH_SWAPPED_EVENT = process.env.hasOwnProperty('FEAT_ONEINCH_SWAPPED_EVENT')
    ? process.env.FEAT_ONEINCH_SWAPPED_EVENT === 'true'
    : DEFAULT_FEAT_ONEINCH_SWAPPED_EVENT;
export const FEAT_PANCAKE_VIP_EVENT = process.env.hasOwnProperty('FEAT_PANCAKE_VIP_EVENT')
    ? process.env.FEAT_PANCAKE_VIP_EVENT === 'true'
    : DEFAULT_FEAT_PANCAKE_VIP_EVENT;

export const ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK = process.env.ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK
    ? parseInt(process.env.ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK, 10)
    : -1;
if (ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK === -1 && FEAT_ONEINCH_SWAPPED_EVENT) {
    throwError(
        `The Oneinch Swapped Event scraper is enabled, but no ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK was provided. Please add a deployment block or disable the feature`,
    );
}
