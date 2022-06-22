import { web3Factory } from '@0x/dev-utils';
import { logger } from '../utils/logger';
import { Web3Source } from '../data_sources/events/web3';

import { ETHEREUM_RPC_URL } from '../config';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});
const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);

export class ChainIdChecker {
    public checkChainId(expected: number): void {
        web3Source.getChainIdAsync().then((connetedChainId) => {
            if (connetedChainId != expected) {
                logger.fatal(`Incorrect Chain ID. Expected: ${expected}, connected: ${connetedChainId}`);
                process.exit(1);
            } else {
                logger.info(`Connected to Chain ID ${connetedChainId}`);
            }
        });
    }
}
