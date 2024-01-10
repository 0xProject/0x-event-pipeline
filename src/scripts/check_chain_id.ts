import { EVM_RPC_URL } from '../config';
import { Web3Source } from '../data_sources/events/web3';
import { logger } from '../utils/logger';
import { web3Factory } from '@0x/dev-utils';

const provider = web3Factory.getRpcProvider({
    rpcUrl: EVM_RPC_URL,
});
const web3Source = new Web3Source(provider, EVM_RPC_URL);

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
