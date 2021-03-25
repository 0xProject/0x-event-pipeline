import { web3Factory } from '@0x/dev-utils';
import { Web3ProviderEngine } from '@0x/subproviders';
import { logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import 'reflect-metadata';
import { Connection } from 'typeorm';

import { PullAndSaveWeb3 } from './utils/web3_utils';
import { Web3Source } from '../data_sources/web3';
import {
    BLOCK_FINALITY_THRESHOLD,
    ETHEREUM_RPC_URL,
} from '../config';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});

const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);
const pullAndSaveWeb3 = new PullAndSaveWeb3(web3Source);

async function dummyAsync(): Promise<void> {
};

export class EventScraper {
    public async getParseSaveEventsAsync(connection: Connection): Promise<void> {
        const startTime = new Date().getTime();
        logUtils.log(`pulling events`);
        const latestBlockWithOffset = await calculateEndBlockAsync(provider);

        logUtils.log(`latest block with offset: ${latestBlockWithOffset}`);

        await Promise.all([
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
