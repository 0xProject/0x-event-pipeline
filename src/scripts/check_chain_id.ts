import { Web3Source } from '../data_sources/events/web3';
import { logger } from '../utils/logger';
import { web3Factory } from '@0x/dev-utils';

const web3Source = new Web3Source();

export class ChainIdChecker {
    public async checkChainId(expected: bigint): Promise<void> {
        const connetedChainId = await web3Source.getChainId();
        if (connetedChainId != expected) {
            logger.fatal(`Incorrect Chain ID. Expected: ${expected}, connected: ${connetedChainId}`);
            process.exit(1);
        } else {
            logger.info(`Connected to Chain ID ${connetedChainId}`);
        }
    }
}
