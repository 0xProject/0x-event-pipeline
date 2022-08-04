import { Producer } from 'kafkajs';
import { web3Factory } from '@0x/dev-utils';
import { Web3ProviderEngine } from '@0x/subproviders';
import { logger } from '../utils/logger';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Connection } from 'typeorm';

import { PullAndSaveWeb3 } from './utils/web3_utils';
import { Web3Source } from '../data_sources/events/web3';
import { BLOCK_FINALITY_THRESHOLD, ETHEREUM_RPC_URL } from '../config';

import { SCRIPT_RUN_DURATION } from '../utils/metrics';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});

const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);
const pullAndSaveWeb3 = new PullAndSaveWeb3(web3Source);

export class BlockScraper {
    public async getParseSaveEventsAsync(connection: Connection, producer: Producer): Promise<void> {
        const startTime = new Date().getTime();
        logger.info(`pulling blocks`);
        const latestBlockWithOffset = await calculateEndBlockAsync(provider);

        logger.info(`latest block with offset: ${latestBlockWithOffset}`);

        const promises: Promise<void>[] = [];

        promises.push(pullAndSaveWeb3.getParseSaveBlocks(connection, producer, latestBlockWithOffset));

        await Promise.all(promises);

        const endTime = new Date().getTime();
        const scriptDurationSeconds = (endTime - startTime) / 1000;
        SCRIPT_RUN_DURATION.set({ script: 'blocks' }, scriptDurationSeconds);

        logger.info(`Finished pulling blocks in ${scriptDurationSeconds}`);
    }
}

async function calculateEndBlockAsync(provider: Web3ProviderEngine): Promise<number> {
    const web3Wrapper = new Web3Wrapper(provider);
    const currentBlock = await web3Wrapper.getBlockNumberAsync();
    return currentBlock - BLOCK_FINALITY_THRESHOLD;
}
