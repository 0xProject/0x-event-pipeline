import { EVM_RPC_URL, MAX_BLOCKS_TO_SEARCH, SCHEMA } from '../config';
import { Web3Source } from '../data_sources/events/web3';
import { logger } from '../utils/logger';
import { SCRIPT_RUN_DURATION } from '../utils/metrics';
import { getParseSaveTokensAsync } from './utils/web3_utils';
import { web3Factory } from '@0x/dev-utils';
import { Producer } from 'kafkajs';
import { Connection } from 'typeorm';

const provider = web3Factory.getRpcProvider({
    rpcUrl: EVM_RPC_URL,
});
const web3Source = new Web3Source(provider, EVM_RPC_URL);

export class TokensFromBackfill {
    public async getParseSaveTokensFromBackfillAsync(connection: Connection, producer: Producer): Promise<void> {
        // const eventName = 'TSStandard';
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
