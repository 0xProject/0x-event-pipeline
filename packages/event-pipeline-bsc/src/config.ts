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
    1, // Mainnet
    3, // Ropsten
    4, // Rinkeby
    42, // Kovan
];

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
]

// Parses an environment variable for bridge contracts
// Schema is
// <contractAddress>-<deployedBlockNumber>|<contractAddress>-<deployedBlockNumber>...
function bridgeEnvVarToObject(envVar: string): BridgeContract[] {
    const contracts = envVar.split('|');
    const bridgeContracts = contracts.map((element) => {
        const split = element.split('-');
        return {contract: split[0], startingBlock: Number(split[1])} 
    });
    return bridgeContracts;
}

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
export const BLOCK_FINALITY_THRESHOLD = process.env.BLOCK_FINALITY_THRESHOLD ? parseInt(process.env.BLOCK_FINALITY_THRESHOLD, 10) : DEFAULT_BLOCK_FINALITY_THRESHOLD;
export const SECONDS_BETWEEN_RUNS = process.env.SECONDS_BETWEEN_RUNS ? parseInt(process.env.SECONDS_BETWEEN_RUNS, 10) : DEFAULT_SECONDS_BETWEEN_RUNS;
export const BRIDGE_CONTRACTS = process.env.BRIDGE_CONTRACTS ? bridgeEnvVarToObject(String(process.env.BRIDGE_CONTRACTS)) : bridgeContracts;
export const BRIDGE_TRADE_TOPIC = ['0x349fc08071558d8e3aa92dec9396e4e9f2dfecd6bb9065759d1932e7da43b8a9'];
export const BRIDGEFILL_EVENT_TOPIC = ['0xff3bc5e46464411f331d1b093e1587d2d1aa667f5618f98a95afc4132709d3a9'];
export const START_BLOCK_TIMESTAMP_OFFSET = process.env.START_BLOCK_TIMESTAMP_OFFSET ? parseInt(process.env.START_BLOCK_TIMESTAMP_OFFSET, 10) : DEFAULT_START_BLOCK_TIMESTAMP_OFFSET;
export const MAX_TIME_TO_SEARCH = process.env.MAX_TIME_TO_SEARCH ? parseInt(process.env.MAX_TIME_TO_SEARCH, 10) : DEFAULT_MAX_TIME_TO_SEARCH;
