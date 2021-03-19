import { web3Factory } from '@0x/dev-utils';
import { Web3ProviderEngine } from '@0x/subproviders';
import { logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import 'reflect-metadata';
import { Connection } from 'typeorm';

import { PullAndSaveEvents } from './utils/event_utils';
import { PullAndSaveWeb3 } from './utils/web3_utils';
import { PullAndSaveTheGraphEvents } from './utils/thegraph_utils';
import { Web3Source } from '../data_sources/web3';
import { UniswapV2Source } from '../data_sources/events/uniswap_events';
import {
    BLOCK_FINALITY_THRESHOLD,
    CHAIN_ID,
    ETHEREUM_RPC_URL,
} from '../config';
import { UNISWAPV2_SUBGRAPH_ENDPOINT, SUSHISWAP_SUBGRAPH_ENDPOINT } from '../constants';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});

const uniswapV2Source = new UniswapV2Source();
const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);
const pullAndSaveTheGraphEvents = new PullAndSaveTheGraphEvents();
const pullAndSaveEvents = new PullAndSaveEvents();
const pullAndSaveWeb3 = new PullAndSaveWeb3(web3Source);

async function dummyAsync(): Promise<void> {
};

export class EventScraper {
    public async getParseSaveEventsAsync(connection: Connection): Promise<void> {
        const startTime = new Date().getTime();
        logUtils.log(`pulling events`);
        const latestBlockWithOffset = await calculateEndBlockAsync(provider);
        const latestBlockTimestampWithOffset = await (await web3Source.getBlockInfoAsync(latestBlockWithOffset)).timestamp;

        logUtils.log(`latest block with offset: ${latestBlockWithOffset}`);

        await Promise.all([
            pullAndSaveTheGraphEvents.getParseSaveUniswapSwapsAsync(connection, uniswapV2Source, latestBlockTimestampWithOffset, UNISWAPV2_SUBGRAPH_ENDPOINT, 'UniswapV2'),
            pullAndSaveTheGraphEvents.getParseSaveUniswapSwapsAsync(connection, uniswapV2Source, latestBlockTimestampWithOffset, SUSHISWAP_SUBGRAPH_ENDPOINT, 'Sushiswap'),
            pullAndSaveWeb3.getParseSaveBlocks(connection, latestBlockWithOffset),
            pullAndSaveWeb3.getParseSaveTx(connection, latestBlockWithOffset, false),
            pullAndSaveWeb3.getParseSaveTxReceiptsAsync(connection, latestBlockWithOffset, false),
            pullAndSaveWeb3.getParseSaveTx(connection, latestBlockWithOffset, true),
            pullAndSaveWeb3.getParseSaveTxReceiptsAsync(connection, latestBlockWithOffset, true),
        ]);

        const endTime = new Date().getTime();
        logUtils.log(`finished pulling events and blocks`);
        logUtils.log(`It took ${(endTime - startTime) / 1000 } seconds to complete`);
    };
};

async function calculateEndBlockAsync(provider: Web3ProviderEngine): Promise<number> {
    const web3Wrapper = new Web3Wrapper(provider);
    const currentBlock = await web3Wrapper.getBlockNumberAsync();
    return currentBlock - BLOCK_FINALITY_THRESHOLD;
}
