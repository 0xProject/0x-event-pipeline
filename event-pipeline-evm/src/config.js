"use strict";
exports.__esModule = true;
exports.PARASWAP_CONTRACT_ADDRESS = exports.PARASWAP_DEPLOYMENT_BLOCK = exports.VIP_SWAP_SOURCES = exports.SLINGSHOT_DEPLOYMENT_BLOCK = exports.ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK = exports.FEAT_PARASWAP_SWAPPED_EVENT = exports.FEAT_SLINGSHOT_TRADE_EVENT = exports.FEAT_VIP_SWAP_EVENT = exports.FEAT_ONEINCH_SWAPPED_EVENT = exports.FEAT_TRANSFORMED_ERC20_EVENT = exports.FIRST_SEARCH_BLOCK = exports.STAKING_DEPLOYMENT_BLOCK = exports.MAX_TIME_TO_SEARCH = exports.START_BLOCK_TIMESTAMP_OFFSET = exports.BRIDGEFILL_EVENT_TOPIC = exports.MINUTES_BETWEEN_RUNS = exports.BLOCK_FINALITY_THRESHOLD = exports.CHAIN_ID = exports.MAX_BLOCKS_TO_SEARCH = exports.MAX_BLOCKS_TO_PULL = exports.START_BLOCK_OFFSET = exports.SHOULD_SYNCHRONIZE = exports.POSTGRES_URI = exports.SCHEMA = exports.EP_DEPLOYMENT_BLOCK = exports.ETHEREUM_RPC_URL = void 0;
var constants_1 = require("./constants");
var throwError = function (err) {
    throw new Error(err);
};
var supportedChains = [
    56,
    137, // Polygon
];
exports.ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL
    ? process.env.ETHEREUM_RPC_URL
    : throwError("Must specify valid ETHEREUM_RPC_URL. Got: " + process.env.ETHEREUM_RPC_URL);
exports.EP_DEPLOYMENT_BLOCK = process.env.EP_DEPLOYMENT_BLOCK
    ? parseInt(process.env.EP_DEPLOYMENT_BLOCK, 10)
    : throwError("Must specify valid EP_DEPLOYMENT_BLOCK. Got: " + process.env.EP_DEPLOYMENT_BLOCK);
exports.SCHEMA = process.env.SCHEMA
    ? process.env.SCHEMA
    : throwError("Must specify valid SCHEMA. Got: " + process.env.SCHEMA);
exports.POSTGRES_URI = process.env.POSTGRES_URI || constants_1.DEFAULT_LOCAL_POSTGRES_URI;
exports.SHOULD_SYNCHRONIZE = process.env.SHOULD_SYNCHRONIZE === 'true';
exports.START_BLOCK_OFFSET = process.env.START_BLOCK_OFFSET
    ? parseInt(process.env.START_BLOCK_OFFSET, 10)
    : constants_1.DEFAULT_START_BLOCK_OFFSET;
exports.MAX_BLOCKS_TO_PULL = process.env.MAX_BLOCKS_TO_PULL
    ? parseInt(process.env.MAX_BLOCKS_TO_PULL, 10)
    : constants_1.DEFAULT_MAX_BLOCKS_TO_PULL;
exports.MAX_BLOCKS_TO_SEARCH = process.env.MAX_BLOCKS_TO_SEARCH
    ? parseInt(process.env.MAX_BLOCKS_TO_SEARCH, 10)
    : constants_1.DEFAULT_MAX_BLOCKS_TO_SEARCH;
exports.CHAIN_ID = process.env.CHAIN_ID
    ? parseInt(process.env.CHAIN_ID, 10)
    : throwError("Must specify valid CHAIN_ID. Got: " + process.env.CHAIN_ID);
if (!supportedChains.includes(exports.CHAIN_ID)) {
    throwError("Chain ID " + exports.CHAIN_ID + " is not supported. Please choose a valid Chain ID: " + supportedChains);
}
exports.BLOCK_FINALITY_THRESHOLD = process.env.BLOCK_FINALITY_THRESHOLD
    ? parseInt(process.env.BLOCK_FINALITY_THRESHOLD, 10)
    : constants_1.DEFAULT_BLOCK_FINALITY_THRESHOLD;
exports.MINUTES_BETWEEN_RUNS = process.env.MINUTES_BETWEEN_RUNS
    ? parseInt(process.env.MINUTES_BETWEEN_RUNS, 10)
    : constants_1.DEFAULT_MINUTES_BETWEEN_RUNS;
exports.BRIDGEFILL_EVENT_TOPIC = ['0xe59e71a14fe90157eedc866c4f8c767d3943d6b6b2e8cd64dddcc92ab4c55af8'];
exports.START_BLOCK_TIMESTAMP_OFFSET = process.env.START_BLOCK_TIMESTAMP_OFFSET
    ? parseInt(process.env.START_BLOCK_TIMESTAMP_OFFSET, 10)
    : constants_1.DEFAULT_START_BLOCK_TIMESTAMP_OFFSET;
exports.MAX_TIME_TO_SEARCH = process.env.MAX_TIME_TO_SEARCH
    ? parseInt(process.env.MAX_TIME_TO_SEARCH, 10)
    : constants_1.DEFAULT_MAX_TIME_TO_SEARCH;
exports.STAKING_DEPLOYMENT_BLOCK = process.env.STAKING_DEPLOYMENT_BLOCK
    ? parseInt(process.env.STAKING_DEPLOYMENT_BLOCK, 10)
    : null;
exports.FIRST_SEARCH_BLOCK = Math.min(exports.EP_DEPLOYMENT_BLOCK, exports.STAKING_DEPLOYMENT_BLOCK || Infinity);
exports.FEAT_TRANSFORMED_ERC20_EVENT = process.env.hasOwnProperty('FEAT_TRANSFORMED_ERC20_EVENT')
    ? process.env.FEAT_TRANSFORMED_ERC20_EVENT === 'true'
    : constants_1.DEFAULT_FEAT_TRANSFORMED_ERC20_EVENT;
exports.FEAT_ONEINCH_SWAPPED_EVENT = process.env.hasOwnProperty('FEAT_ONEINCH_SWAPPED_EVENT')
    ? process.env.FEAT_ONEINCH_SWAPPED_EVENT === 'true'
    : constants_1.DEFAULT_FEAT_ONEINCH_SWAPPED_EVENT;
exports.FEAT_VIP_SWAP_EVENT = process.env.hasOwnProperty('FEAT_VIP_SWAP_EVENT')
    ? process.env.FEAT_VIP_SWAP_EVENT === 'true'
    : constants_1.DEFAULT_FEAT_VIP_SWAP_EVENT;
exports.FEAT_SLINGSHOT_TRADE_EVENT = process.env.hasOwnProperty('FEAT_SLINGSHOT_TRADE_EVENT')
    ? process.env.FEAT_SLINGSHOT_TRADE_EVENT === 'true'
    : constants_1.DEFAULT_FEAT_SLINGSHOT_TRADE_EVENT;
exports.FEAT_PARASWAP_SWAPPED_EVENT = process.env.hasOwnProperty('FEAT_PARASWAP_SWAPPED_EVENT')
    ? process.env.FEAT_PARASWAP_SWAPPED_EVENT === 'true'
    : constants_1.DEFAULT_FEAT_PARASWAP_SWAPPED_EVENT;
exports.ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK = process.env.ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK
    ? parseInt(process.env.ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK, 10)
    : -1;
if (exports.ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK === -1 && exports.FEAT_ONEINCH_SWAPPED_EVENT) {
    throwError("The Oneinch Swapped Event scraper is enabled, but no ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK was provided. Please add a deployment block or disable the feature");
}
exports.SLINGSHOT_DEPLOYMENT_BLOCK = process.env.SLINGSHOT_DEPLOYMENT_BLOCK
    ? parseInt(process.env.SLINGSHOT_DEPLOYMENT_BLOCK, 10)
    : -1;
if (exports.SLINGSHOT_DEPLOYMENT_BLOCK === -1 && exports.FEAT_SLINGSHOT_TRADE_EVENT) {
    throwError("The Slingshot Trade Event scraper is enabled, but no SLINGSHOT_DEPLOYMENT_BLOCK was provided. Please add a deployment block or disable the feature");
}
exports.VIP_SWAP_SOURCES = process.env.VIP_SWAP_SOURCES ? process.env.VIP_SWAP_SOURCES.split(',') : undefined;
if (exports.VIP_SWAP_SOURCES === undefined && exports.FEAT_VIP_SWAP_EVENT) {
    throwError("The VIP Swap Event scraper is enabled, but no VIP_SWAP_SOURCES was provided. Please include a comma separated list of the enabled VIP sources in this chain or disable the feature");
}
exports.PARASWAP_DEPLOYMENT_BLOCK = process.env.PARASWAP_DEPLOYMENT_BLOCK
    ? parseInt(process.env.PARASWAP_DEPLOYMENT_BLOCK, 10)
    : -1;
if (exports.PARASWAP_DEPLOYMENT_BLOCK === -1 && exports.FEAT_PARASWAP_SWAPPED_EVENT) {
    throwError("The Paraswap Swapped Event scraper is enabled, but no PARASWAP_DEPLOYMENT_BLOCK was provided. Please add a deployment block or disable the feature");
}
exports.PARASWAP_CONTRACT_ADDRESS = process.env.PARASWAP_CONTRACT_ADDRESS
    ? process.env.PARASWAP_CONTRACT_ADDRESS
    : '';
if (exports.PARASWAP_CONTRACT_ADDRESS === '' && exports.FEAT_PARASWAP_SWAPPED_EVENT) {
    throwError("The Paraswap Swapped Event scraper is enabled, but no PARASWAP_CONTRACT_ADDRESS was provided. Please add a deployment block or disable the feature");
}
