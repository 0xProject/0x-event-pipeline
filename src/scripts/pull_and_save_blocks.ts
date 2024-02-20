import { EVM_RPC_URL } from '../config';
import { Web3Source } from '../data_sources/events/web3';
import { logger } from '../utils/logger';
import { SCRIPT_RUN_DURATION } from '../utils/metrics';
import { calculateEndBlockAsync } from './utils/shared_utils';
import { PullAndSaveWeb3 } from './utils/web3_utils';
import { web3Factory } from '@0x/dev-utils';
import { Producer } from 'kafkajs';
import { Connection } from 'typeorm';

const provider = web3Factory.getRpcProvider({
    rpcUrl: EVM_RPC_URL,
});

const web3Source = new Web3Source(provider, EVM_RPC_URL);
const pullAndSaveWeb3 = new PullAndSaveWeb3(web3Source);

export class BlockScraper {
    public async getParseSaveEventsAsync(connection: Connection, producer: Producer): Promise<void> {
        const startTime = new Date().getTime();
        logger.info(`pulling blocks`);
        const latestBlockWithOffset = await calculateEndBlockAsync(web3Source);

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
