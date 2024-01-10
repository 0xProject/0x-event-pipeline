import { EVM_RPC_URL, MAX_BLOCKS_TO_SEARCH, TOKENS_FROM_TRANSFERS_START_BLOCK } from '../config';
import { TOKEN_TRANSFER_EVENT_TOPIC } from '../constants';
import { LogPullInfo, Web3Source } from '../data_sources/events/web3';
import { logger } from '../utils/logger';
import { SCRIPT_RUN_DURATION, SCAN_START_BLOCK, SCAN_END_BLOCK } from '../utils/metrics';
import { getLastBlockProcessedEntity } from './utils/event_abi_utils';
import { getStartBlockAsync } from './utils/event_abi_utils';
import { getParseSaveTokensAsync } from './utils/web3_utils';
import { web3Factory } from '@0x/dev-utils';
import { RawLog } from 'ethereum-types';
import { Producer } from 'kafkajs';
import { Connection } from 'typeorm';

const provider = web3Factory.getRpcProvider({
    rpcUrl: EVM_RPC_URL,
});
const web3Source = new Web3Source(provider, EVM_RPC_URL);

export class TokensFromTransfersScraper {
    public async getParseSaveTokensFromTransfersAsync(connection: Connection, producer: Producer): Promise<void> {
        const eventName = 'TSStandard';
        const startTime = new Date().getTime();
        logger.info(`Pulling Tokens from Transfers`);
        const currentBlock = await web3Source.getCurrentBlockAsync();

        logger.info(`latest block: ${currentBlock.number}`);

        const { startBlockNumber, hasLatestBlockChanged } = await getStartBlockAsync(
            eventName,
            connection,
            web3Source,
            currentBlock,
            TOKENS_FROM_TRANSFERS_START_BLOCK,
        );

        if (!hasLatestBlockChanged) {
            logger.debug(`No new blocks to scan for ${eventName}, skipping`);
            return;
        }

        const endBlockNumber = Math.min(currentBlock.number!, startBlockNumber + (MAX_BLOCKS_TO_SEARCH - 1));
        logger.info(`Searching for ${eventName} between blocks ${startBlockNumber} and ${endBlockNumber}`);

        let endBlockHash = null;
        try {
            endBlockHash = (await web3Source.getBlockInfoAsync(endBlockNumber)).hash;
        } catch (err) {
            logger.error(`${err}, trying next time`);
            return;
        }
        if (endBlockHash === null) {
            logger.error(`Unstable last block for ${eventName}, trying next time`);
            return;
        }

        SCAN_START_BLOCK.labels({ type: 'token-scraping', event: eventName }).set(startBlockNumber);
        SCAN_END_BLOCK.labels({ type: 'token-scraping', event: eventName }).set(endBlockNumber);

        const logPullInfo: LogPullInfo = {
            address: 'nofilter',
            fromBlock: startBlockNumber,
            toBlock: endBlockNumber,
            topics: TOKEN_TRANSFER_EVENT_TOPIC,
        };

        const rawLogsArray = await web3Source.getBatchLogInfoForContractsAsync([logPullInfo]);

        logger.debug(`Got ${rawLogsArray.length} transfers`);

        const tokens = [
            ...new Set(rawLogsArray.map((logPull) => logPull.logs.map((log: RawLog) => log.address)).flat()),
        ];

        logger.debug(`Got ${tokens.length} tokens`);

        const savedTokenCount = await getParseSaveTokensAsync(connection, producer, web3Source, tokens);

        logger.info(`Saved metadata for ${savedTokenCount} tokens`);

        const lastBlockProcessed = getLastBlockProcessedEntity(eventName, endBlockNumber, endBlockHash);
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('REPEATABLE READ');
        await queryRunner.manager.save(lastBlockProcessed);
        await queryRunner.commitTransaction();
        await queryRunner.release();

        const endTime = new Date().getTime();
        const scriptDurationSeconds = (endTime - startTime) / 1000;
        SCRIPT_RUN_DURATION.set({ script: 'token-scraping' }, scriptDurationSeconds);

        logger.info(`Finished pulling Tokens from Transfers in ${scriptDurationSeconds}`);
    }
}
