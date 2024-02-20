import { CHAIN_NAME, EVM_RPC_URL } from '../config';
import { logger } from '../utils/logger';
import { CURRENT_BLOCK } from '../utils/metrics';
import { web3Factory } from '@0x/dev-utils';
import { Web3Wrapper } from '@0x/web3-wrapper';

const provider = web3Factory.getRpcProvider({
    rpcUrl: EVM_RPC_URL,
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
