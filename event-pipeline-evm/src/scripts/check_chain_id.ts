import { web3Factory } from '@0x/dev-utils';
import { logger } from '@0x/pipeline-utils';
import { Web3Source } from '../data_sources/events/web3';

import { ETHEREUM_RPC_URL } from '../config';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});
const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);

export class ChainIdChecker {
    public async checkChainIdAsync(expected: number) {
        const connetedChainId = await web3Source.getChainIdAsync();
        if (connetedChainId != expected) {
            logger.fatal(`Incorrect Chain ID. Expected: ${expected}, connected: ${connetedChainId}`);
            process.exit(1);
        } else {
            logger.info(`Connected to Chain ID ${connetedChainId}`);
        }
    }
}
