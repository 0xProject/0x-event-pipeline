import { Web3Wrapper } from '@0x/web3-wrapper';
import { web3Factory } from '@0x/dev-utils';
import { logger } from '../utils/logger';
import { Gauge } from 'prom-client';

import { CHAIN_NAME, ETHEREUM_RPC_URL } from '../config';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});

export const CURRENT_BLOCK = new Gauge({
    name: 'event_scraper_current_block',
    help: 'The current head of the chain',
    labelNames: ['chain'],
});

export class CurrentBlockMonitor {
    public async monitor(): Promise<void> {
        const web3Wrapper = new Web3Wrapper(provider);
        let currentBlock = -1;
        try {
            currentBlock = await web3Wrapper.getBlockNumberAsync();
        } catch (err) {
            logger.error(err);
        }
        CURRENT_BLOCK.labels({ chain: CHAIN_NAME }).set(currentBlock);
        logger.info(`Current block: ${currentBlock}`);
    }
}
