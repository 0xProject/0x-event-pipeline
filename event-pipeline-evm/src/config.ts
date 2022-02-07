import { logger } from './utils/logger';

import {
    DEFAULT_BASE_GITHUB_LOGO_URL,
    DEFAULT_BLOCK_FINALITY_THRESHOLD,
    DEFAULT_ENABLE_PROMETHEUS_METRICS,
    DEFAULT_EP_ADDRESS,
    DEFAULT_FEAT_CANCEL_EVENTS,
    DEFAULT_FEAT_LIMIT_ORDERS,
    DEFAULT_FEAT_NFT,
    DEFAULT_FEAT_ONEINCH_SWAPPED_V3_EVENT,
    DEFAULT_FEAT_ONEINCH_SWAPPED_V4_EVENT,
    DEFAULT_FEAT_OPEN_OCEAN_SWAPPED_V1_EVENT,
    DEFAULT_FEAT_OTC_ORDERS,
    DEFAULT_FEAT_PARASWAP_SWAPPED_V4_EVENT,
    DEFAULT_FEAT_PARASWAP_SWAPPED_V5_EVENT,
    DEFAULT_FEAT_PLP_SWAP_EVENT,
    DEFAULT_FEAT_RFQ_EVENT,
    DEFAULT_FEAT_SLINGSHOT_TRADE_EVENT,
    DEFAULT_FEAT_STAKING,
    DEFAULT_FEAT_TIMECHAIN_SWAP_V1_EVENT,
    DEFAULT_FEAT_TRANSFORMED_ERC20_EVENT,
    DEFAULT_FEAT_UNISWAP_V3_VIP_SWAP_EVENT,
    DEFAULT_FEAT_V3_FILL_EVENT,
    DEFAULT_FEAT_V3_NATIVE_FILL,
    DEFAULT_FEAT_VIP_SWAP_EVENT,
    DEFAULT_LOCAL_POSTGRES_URI,
    DEFAULT_MAX_BLOCKS_TO_PULL,
    DEFAULT_MAX_BLOCKS_TO_SEARCH,
    DEFAULT_MAX_TIME_TO_SEARCH,
    DEFAULT_METRICS_PATH,
    DEFAULT_MINUTES_BETWEEN_RUNS,
    DEFAULT_PROMETHEUS_PORT,
    DEFAULT_STAKING_POOLS_JSON_URL,
    DEFAULT_STAKING_POOLS_METADATA_JSON_URL,
    DEFAULT_START_BLOCK_OFFSET,
    DEFAULT_START_BLOCK_TIMESTAMP_OFFSET,
} from './constants';

const throwError = (err: string) => {
    throw new Error(err);
};

interface Map {
    [key: string]: { name: string };
}

const supportedChains: Map = {
    1: { name: 'Ethereum' },
    3: { name: 'Ropsten' },
    10: { name: 'Optimism' },
    56: { name: 'BSC' },
    137: { name: 'Polygon' },
    250: { name: 'Fantom' },
    43114: { name: 'Avalanche' },
    42220: { name: 'Celo' },
};

interface BridgeContract {
    contract: string;
    startingBlock: number;
}

const bridgeContracts = [
    { contract: '0x1c29670f7a77f1052d30813a0a4f632c78a02610', startingBlock: 9613431 },
    { contract: '0x991c745401d5b5e469b8c3e2cb02c748f08754f1', startingBlock: 9613441 },
    { contract: '0x6dc7950423ada9f56fb2c93a23edb787f1e29088', startingBlock: 9613455 },
    { contract: '0x36691c4f426eb8f42f150ebde43069a31cb080ad', startingBlock: 9613448 },
    { contract: '0x2818363fb1686c2720b05c4e789165909cd03fc9', startingBlock: 9684028 },
    { contract: '0xc16f74b07e2409e869bae5de01b2265fe32d64e6', startingBlock: 9684280 },
    { contract: '0xd642305ed462cf2ad2a5f0310e30f66bcd1f0f0b', startingBlock: 9684143 },
    { contract: '0x7df9964cad51486eb16e6d3c9341d6eed73de69d', startingBlock: 9684978 },
];

// Parses an environment variable for bridge contracts
// Schema is
// <contractAddress>-<deployedBlockNumber>|<contractAddress>-<deployedBlockNumber>...
function bridgeEnvVarToObject(envVar: string): BridgeContract[] {
    const contracts = envVar.split('|');
    const bridgeContracts = contracts.map(element => {
        const split = element.split('-');
        return { contract: split[0], startingBlock: Number(split[1]) };
    });
    return bridgeContracts;
}

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

export const ENABLE_PROMETHEUS_METRICS = getBoolConfig('ENABLE_PROMETHEUS_METRICS', DEFAULT_ENABLE_PROMETHEUS_METRICS);
export const METRICS_PATH = process.env.METRICS_PATH || DEFAULT_METRICS_PATH;

export const PROMETHEUS_PORT = getIntConfig('PROMETHEUS_PORT', DEFAULT_PROMETHEUS_PORT);

export const START_BLOCK_OFFSET = getIntConfig('START_BLOCK_OFFSET', DEFAULT_START_BLOCK_OFFSET);

export const MAX_BLOCKS_TO_PULL = getIntConfig('MAX_BLOCKS_TO_PULL', DEFAULT_MAX_BLOCKS_TO_PULL);

export const MAX_BLOCKS_TO_SEARCH = getIntConfig('MAX_BLOCKS_TO_SEARCH', DEFAULT_MAX_BLOCKS_TO_SEARCH);

export const CHAIN_ID = process.env.CHAIN_ID
    ? parseInt(process.env.CHAIN_ID, 10)
    : throwError(`Must specify valid CHAIN_ID. Got: ${process.env.CHAIN_ID}`);
if (
    !Object.keys(supportedChains)
        .map(Number)
        .includes(CHAIN_ID)
) {
    throwError(`Chain ID ${CHAIN_ID} is not supported. Please choose a valid Chain ID: ${supportedChains}`);
}

export const CHAIN_NAME = supportedChains[CHAIN_ID].name;

export const EP_ADDRESS = process.env.EP_ADDRESS ? process.env.EP_ADDRESS : DEFAULT_EP_ADDRESS;

export const BLOCK_FINALITY_THRESHOLD = getIntConfig('BLOCK_FINALITY_THRESHOLD', DEFAULT_BLOCK_FINALITY_THRESHOLD);

export let MINUTES_BETWEEN_RUNS = getIntConfig('MINUTES_BETWEEN_RUNS', DEFAULT_MINUTES_BETWEEN_RUNS);
export const SECONDS_BETWEEN_RUNS = getIntConfig('SECONDS_BETWEEN_RUNS', 60);
if (SECONDS_BETWEEN_RUNS !== 60) {
    if (Object.prototype.hasOwnProperty.call(process.env, 'MINUTES_BETWEEN_RUNS')) {
        throwError(`MINUTES_BETWEEN_RUNS and SECONDS_BETWEEN_RUNS are mutually exclusive, use only one`);
    } else {
        MINUTES_BETWEEN_RUNS = 1;
    }
}

export const STAKING_POOLS_JSON_URL = process.env.STAKING_POOLS_JSON_URL || DEFAULT_STAKING_POOLS_JSON_URL;

export const STAKING_POOLS_METADATA_JSON_URL =
    process.env.STAKING_POOLS_METADATA_JSON_URL || DEFAULT_STAKING_POOLS_METADATA_JSON_URL;

export const BASE_GITHUB_LOGO_URL = process.env.BASE_GITHUB_LOGO_URL || DEFAULT_BASE_GITHUB_LOGO_URL;

export const BRIDGE_CONTRACTS = process.env.BRIDGE_CONTRACTS
    ? bridgeEnvVarToObject(String(process.env.BRIDGE_CONTRACTS))
    : bridgeContracts;

// TODO move to constants or make configurable
export const BRIDGEFILL_EVENT_TOPIC = ['0xe59e71a14fe90157eedc866c4f8c767d3943d6b6b2e8cd64dddcc92ab4c55af8'];

export const START_BLOCK_TIMESTAMP_OFFSET = getIntConfig(
    'START_BLOCK_TIMESTAMP_OFFSET',
    DEFAULT_START_BLOCK_TIMESTAMP_OFFSET,
);

export const MAX_TIME_TO_SEARCH = getIntConfig('MAX_TIME_TO_SEARCH', DEFAULT_MAX_TIME_TO_SEARCH);

export const FEAT_CANCEL_EVENTS = getBoolConfig('FEAT_CANCEL_EVENTS', DEFAULT_FEAT_CANCEL_EVENTS);

export const FEAT_STAKING = getBoolConfig('FEAT_STAKING', DEFAULT_FEAT_STAKING);
export const STAKING_DEPLOYMENT_BLOCK = getIntConfig('STAKING_DEPLOYMENT_BLOCK', -1);
if (STAKING_DEPLOYMENT_BLOCK === -1 && FEAT_STAKING) {
    throwError(
        `The Staking scraper is enabled, but no STAKING_DEPLOYMENT_BLOCK was provided. Please include STAKING_DEPLOYMENT_BLOCK or disable the feature`,
    );
}

export const STAKING_PROXY_DEPLOYMENT_TRANSACTION = process.env.STAKING_PROXY_DEPLOYMENT_TRANSACTION
    ? process.env.STAKING_PROXY_DEPLOYMENT_TRANSACTION
    : null;
if (STAKING_PROXY_DEPLOYMENT_TRANSACTION === null && FEAT_STAKING) {
    throwError(
        `The Staking scraper is enabled, but no STAKING_PROXY_DEPLOYMENT_TRANSACTION was provided. Please include STAKING_PROXY_DEPLOYMENT_TRANSACTION or disable the feature`,
    );
}

export const FEAT_TIMECHAIN_SWAP_V1_EVENT = getBoolConfig(
    'FEAT_TIMECHAIN_SWAP_V1_EVENT',
    DEFAULT_FEAT_TIMECHAIN_SWAP_V1_EVENT,
);
export const TIMECHAIN_V1_DEPLOYMENT_BLOCK = getIntConfig('TIMECHAIN_V1_DEPLOYMENT_BLOCK', -1);
if (TIMECHAIN_V1_DEPLOYMENT_BLOCK === -1 && FEAT_TIMECHAIN_SWAP_V1_EVENT) {
    throwError(
        `The Tinechain Swap v1 scraper is enabled, but no TIMECHAIN_V1_DEPLOYMENT_BLOCK was provided. Please include TIMECHAIN_V1_DEPLOYMENT_BLOCK or disable the feature`,
    );
}

export const FIRST_SEARCH_BLOCK = Math.min(
    EP_DEPLOYMENT_BLOCK,
    STAKING_DEPLOYMENT_BLOCK === -1 ? Infinity : STAKING_DEPLOYMENT_BLOCK,
);

export const FEAT_TRANSFORMED_ERC20_EVENT = getBoolConfig(
    'FEAT_TRANSFORMED_ERC20_EVENT',
    DEFAULT_FEAT_TRANSFORMED_ERC20_EVENT,
);

export const FEAT_ONEINCH_SWAPPED_V3_EVENT = getBoolConfig(
    'FEAT_ONEINCH_SWAPPED_V3_EVENT',
    DEFAULT_FEAT_ONEINCH_SWAPPED_V3_EVENT,
);

export const FEAT_ONEINCH_SWAPPED_V4_EVENT = getBoolConfig(
    'FEAT_ONEINCH_SWAPPED_V4_EVENT',
    DEFAULT_FEAT_ONEINCH_SWAPPED_V4_EVENT,
);

export const FEAT_OPEN_OCEAN_SWAPPED_V1_EVENT = getBoolConfig(
    'FEAT_OPEN_OCEAN_SWAPPED_V1_EVENT',
    DEFAULT_FEAT_OPEN_OCEAN_SWAPPED_V1_EVENT,
);
export const OPEN_OCEAN_V1_DEPLOYMENT_BLOCK = getIntConfig('OPEN_OCEAN_V1_DEPLOYMENT_BLOCK', -1);
if (OPEN_OCEAN_V1_DEPLOYMENT_BLOCK === -1 && FEAT_OPEN_OCEAN_SWAPPED_V1_EVENT) {
    throwError(
        `The Open Ocean Swapped v1 scraper is enabled, but no OPEN_OCEAN_V1_DEPLOYMENT_BLOCK was provided. Please include OPEN_OCEAN_V1_DEPLOYMENT_BLOCK or disable the feature`,
    );
}

export const FEAT_VIP_SWAP_EVENT = getBoolConfig('FEAT_VIP_SWAP_EVENT', DEFAULT_FEAT_VIP_SWAP_EVENT);

export const FEAT_SLINGSHOT_TRADE_EVENT = getBoolConfig(
    'FEAT_SLINGSHOT_TRADE_EVENT',
    DEFAULT_FEAT_SLINGSHOT_TRADE_EVENT,
);

export const FEAT_PARASWAP_SWAPPED_V4_EVENT = getBoolConfig(
    'FEAT_PARASWAP_SWAPPED_V4_EVENT',
    DEFAULT_FEAT_PARASWAP_SWAPPED_V4_EVENT,
);

export const FEAT_PARASWAP_SWAPPED_V5_EVENT = getBoolConfig(
    'FEAT_PARASWAP_SWAPPED_V5_EVENT',
    DEFAULT_FEAT_PARASWAP_SWAPPED_V5_EVENT,
);

export const ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK = getIntConfig('ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK', -1);
if (ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK === -1 && FEAT_ONEINCH_SWAPPED_V3_EVENT) {
    throwError(
        `The Oneinch Swapped v3 Event scraper is enabled, but no ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK was provided. Please add a deployment block or disable the feature`,
    );
}

export const ONEINCH_ROUTER_V4_DEPLOYMENT_BLOCK = getIntConfig('ONEINCH_ROUTER_V4_DEPLOYMENT_BLOCK', -1);
if (ONEINCH_ROUTER_V4_DEPLOYMENT_BLOCK === -1 && FEAT_ONEINCH_SWAPPED_V4_EVENT) {
    throwError(
        `The Oneinch Swapped v4 Event scraper is enabled, but no ONEINCH_ROUTER_V4_DEPLOYMENT_BLOCK was provided. Please add a deployment block or disable the feature`,
    );
}

export const SLINGSHOT_DEPLOYMENT_BLOCK = getIntConfig('SLINGSHOT_DEPLOYMENT_BLOCK', -1);
if (SLINGSHOT_DEPLOYMENT_BLOCK === -1 && FEAT_SLINGSHOT_TRADE_EVENT) {
    throwError(
        `The Slingshot Trade Event scraper is enabled, but no SLINGSHOT_DEPLOYMENT_BLOCK was provided. Please add a deployment block or disable the feature`,
    );
}

export const VIP_SWAP_SOURCES = process.env.VIP_SWAP_SOURCES ? process.env.VIP_SWAP_SOURCES.split(',') : undefined;
if (VIP_SWAP_SOURCES === undefined && FEAT_VIP_SWAP_EVENT) {
    throwError(
        `The VIP Swap Event scraper is enabled, but no VIP_SWAP_SOURCES was provided. Please include a comma separated list of the enabled VIP sources in this chain or disable the feature`,
    );
}

export const PARASWAP_V4_DEPLOYMENT_BLOCK = getIntConfig('PARASWAP_V4_DEPLOYMENT_BLOCK', -1);
if (PARASWAP_V4_DEPLOYMENT_BLOCK === -1 && FEAT_PARASWAP_SWAPPED_V4_EVENT) {
    throwError(
        `The Paraswap Swapped v4 Event scraper is enabled, but no PARASWAP_V4_DEPLOYMENT_BLOCK was provided. Please add a deployment block or disable the feature`,
    );
}

export const PARASWAP_V4_CONTRACT_ADDRESS = process.env.PARASWAP_V4_CONTRACT_ADDRESS || '';
if (PARASWAP_V4_CONTRACT_ADDRESS === '' && FEAT_PARASWAP_SWAPPED_V4_EVENT) {
    throwError(
        `The Paraswap Swapped v4 Event scraper is enabled, but no PARASWAP_V4_CONTRACT_ADDRESS was provided. Please add a deployment block or disable the feature`,
    );
}

export const PARASWAP_V5_DEPLOYMENT_BLOCK = getIntConfig('PARASWAP_V5_DEPLOYMENT_BLOCK', -1);
if (PARASWAP_V5_DEPLOYMENT_BLOCK === -1 && FEAT_PARASWAP_SWAPPED_V5_EVENT) {
    throwError(
        `The Paraswap Swapped v5 Event scraper is enabled, but no PARASWAP_V5_DEPLOYMENT_BLOCK was provided. Please add a deployment block or disable the feature`,
    );
}

export const PARASWAP_V5_CONTRACT_ADDRESS = process.env.PARASWAP_V5_CONTRACT_ADDRESS || '';
if (PARASWAP_V5_CONTRACT_ADDRESS === '' && FEAT_PARASWAP_SWAPPED_V5_EVENT) {
    throwError(
        `The Paraswap Swapped v5 Event scraper is enabled, but no PARASWAP_V5_CONTRACT_ADDRESS was provided. Please add a deployment block or disable the feature`,
    );
}

export const FEAT_RFQ_EVENT = getBoolConfig('FEAT_RFQ_EVENT', DEFAULT_FEAT_RFQ_EVENT);

export const FEAT_LIMIT_ORDERS = getBoolConfig('FEAT_LIMIT_ORDERS', DEFAULT_FEAT_LIMIT_ORDERS);

export const V4_NATIVE_FILL_START_BLOCK = getIntConfig('V4_NATIVE_FILL_START_BLOCK', -1);
validateStartBlock('V4_NATIVE_FILL_START_BLOCK', V4_NATIVE_FILL_START_BLOCK, 'FEAT_RFQ_EVENT', FEAT_RFQ_EVENT);
validateStartBlock('V4_NATIVE_FILL_START_BLOCK', V4_NATIVE_FILL_START_BLOCK, 'FEAT_LIMIT_ORDERS', FEAT_LIMIT_ORDERS);

export const FEAT_PLP_SWAP_EVENT = getBoolConfig('FEAT_PLP_SWAP_EVENT', DEFAULT_FEAT_PLP_SWAP_EVENT);

export const PLP_VIP_START_BLOCK = getIntConfig('PLP_VIP_START_BLOCK', -1);
validateStartBlock('PLP_VIP_START_BLOCK', PLP_VIP_START_BLOCK, 'FEAT_PLP_SWAP_EVENT', FEAT_PLP_SWAP_EVENT);

export const FEAT_V3_NATIVE_FILL = getBoolConfig('FEAT_V3_NATIVE_FILL', DEFAULT_FEAT_V3_NATIVE_FILL);

export const FEAT_UNISWAP_V3_VIP_SWAP_EVENT = getBoolConfig(
    'FEAT_UNISWAP_V3_VIP_SWAP_EVENT',
    DEFAULT_FEAT_UNISWAP_V3_VIP_SWAP_EVENT,
);
export const RFQ_EXPIRY_START_BLOCK = process.env.RFQ_EXPIRY_START_BLOCK
    ? parseInt(process.env.RFQ_EXPIRY_START_BLOCK, 10)
    : EP_DEPLOYMENT_BLOCK;

if (EP_DEPLOYMENT_BLOCK === RFQ_EXPIRY_START_BLOCK && !process.env.RFQ_EXPIRY_START_BLOCK && FEAT_RFQ_EVENT) {
    logger.warn(
        'Using V4_NATIVE_FILL_START_BLOCK as RFQ_EXPIRY_START_BLOCK because no RFQ_EXPIRY_START_BLOCK was provided',
    );
}
export const FEAT_V3_FILL_EVENT = getBoolConfig('FEAT_V3_FILL_EVENT', DEFAULT_FEAT_V3_FILL_EVENT);

export const FEAT_OTC_ORDERS = getBoolConfig('FEAT_OTC_ORDERS', DEFAULT_FEAT_OTC_ORDERS);

export const OTC_ORDERS_FEATURE_START_BLOCK = getIntConfig('OTC_ORDERS_FEATURE_START_BLOCK', -1);
validateStartBlock(
    'OTC_ORDERS_FEATURE_START_BLOCK',
    OTC_ORDERS_FEATURE_START_BLOCK,
    'FEAT_OTC_ORDERS',
    FEAT_OTC_ORDERS,
);

export const FEAT_NFT = getBoolConfig('FEAT_NFT', DEFAULT_FEAT_NFT);

export const NFT_FEATURE_START_BLOCK = getIntConfig('NFT_FEATURE_START_BLOCK', -1);
validateStartBlock('NFT_FEATURE_START_BLOCK', NFT_FEATURE_START_BLOCK, 'FEAT_NFT', FEAT_NFT);

function getBoolConfig(env: string, defaultValue: boolean): boolean {
    if (Object.prototype.hasOwnProperty.call(process.env, env)) {
        return process.env[env] === 'true';
    }
    return defaultValue;
}

function getIntConfig(env: string, defaultValue: number): number {
    if (Object.prototype.hasOwnProperty.call(process.env, env)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return parseInt(process.env[env]!);
    }
    return defaultValue;
}

function validateStartBlock(startBlockVar: string, startBlock: number, featureFlagVar: string, featureFlag: boolean) {
    if (startBlock === -1 && featureFlag) {
        throwError(
            `${featureFlagVar} is enabled but ${startBlockVar} is not set. Please set ${startBlockVar} or disable the feature`,
        );
    }
}
