import { Producer } from 'kafkajs';
import { web3Factory } from '@0x/dev-utils';
import { logger } from '../utils/logger';
import { Connection } from 'typeorm';
import { calculateEndBlockAsync } from './utils/shared_utils';
import { LogPullInfo, Web3Source } from '../data_sources/events/web3';
import { getParseSaveTokensAsync } from './utils/web3_utils';
import { getLastBlockProcessedEntity } from './utils/event_abi_utils';
import { RawLog } from 'ethereum-types';

import { ETHEREUM_RPC_URL, MAX_BLOCKS_TO_SEARCH, SCHEMA, START_BLOCK_OFFSET } from '../config';
import { TOKEN_TRANSFER_EVENT_TOPIC } from '../constants';

import { SCRIPT_RUN_DURATION, SCAN_START_BLOCK, SCAN_END_BLOCK } from '../utils/metrics';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});
const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);

export class TokensFromBackfill {
    public async getParseSaveTokensFromBackfillAsync(connection: Connection, producer: Producer): Promise<void> {
        const eventName = 'TSStandard';
        const startTime = new Date().getTime();
        logger.info(`Pulling Tokens from Backfill`);

        const queryResult = await connection.query(
            `SELECT address FROM ${SCHEMA}.tokens_backfill LIMIT ${MAX_BLOCKS_TO_SEARCH}`,
        );

        const tokens = queryResult.map((e: { address: string }) => e.address);

        if (tokens.length > 0) {
            logger.debug(`Got ${tokens.length} backfill tokens`);

            const savedTokenCount = await getParseSaveTokensAsync(connection, producer, web3Source, tokens);

            const tokenList = tokens.map((token: string) => `'${token}'`).toString();
            const tokenBackfillQuery = `DELETE FROM ${SCHEMA}.tokens_backfill WHERE address IN (${tokenList});`;
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();

            await queryRunner.startTransaction();
            await queryRunner.manager.query(tokenBackfillQuery);
            await queryRunner.commitTransaction();
            await queryRunner.release();

            logger.info(`Saved metadata for ${savedTokenCount} backfill tokens`);

            const endTime = new Date().getTime();
            const scriptDurationSeconds = (endTime - startTime) / 1000;
            SCRIPT_RUN_DURATION.set({ script: 'token-backfill' }, scriptDurationSeconds);

            logger.info(`Finished pulling Tokens from Backfill in ${scriptDurationSeconds}`);
        }
    }
}
