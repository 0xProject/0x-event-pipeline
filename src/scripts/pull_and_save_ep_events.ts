import { web3Factory } from '@0x/dev-utils';
import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';
import { Web3Source, LogPullInfo } from '../data_sources/web3';
import { calculateEndBlockAsync, lastBlockProcessedAsync } from './utils/shared_utils';

import { RawLogEntry } from 'ethereum-types';

import { TransformedERC20Event, LastBlockProcessed } from '../entities';

import { ETHEREUM_RPC_URL, START_BLOCK_OFFSET, MAX_BLOCKS_TO_SEARCH } from '../config';
import { TRANSFORMEDERC20_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EXCHANGE_PROXY_DEPLOYMENT_BLOCK } from '../constants';
import { parseTransformedERC20Event } from '../parsers/events/transformed_erc20_events';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});
const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);

export class EPScraper {
    public async getParseSaveEPEvents(connection: Connection): Promise<void> {
        logUtils.log(`pulling bridge trades`);

        const latestBlockWithOffset = await calculateEndBlockAsync(web3Source);
        const eventName = 'TransformedERC20Event';
        const fromBlock = await this._getStartBlockAsync(eventName, EXCHANGE_PROXY_DEPLOYMENT_BLOCK, connection, latestBlockWithOffset);

        const toBlock = Math.min(latestBlockWithOffset, fromBlock + (MAX_BLOCKS_TO_SEARCH - 1));
        const logPullInfo: LogPullInfo = {
            address: EXCHANGE_PROXY_ADDRESS,
            fromBlock,
            toBlock,
            topics: TRANSFORMEDERC20_EVENT_TOPIC
        };

        const rawLogsArray = await web3Source.getBatchLogInfoForContractsAsync([logPullInfo]);

        await Promise.all(rawLogsArray.map(async rawLogs => {
            const parsedLogs = rawLogs.logs.map((encodedLog: RawLogEntry) => parseTransformedERC20Event(encodedLog));

            logUtils.log(`Saving ${parsedLogs.length} Transformed ERC20 events`)

            const eventName = 'TransformedERC20Event';

            await this._deleteOverlapAndSaveTransformedERC20EventsAsync(
                connection,
                parsedLogs,
                rawLogs.logPull.address,
                rawLogs.logPull.fromBlock,
                rawLogs.logPull.toBlock,
                'transformed_erc20_events',
                await lastBlockProcessedAsync(eventName, rawLogs.logPull.toBlock),
            );
        }));
        
        logUtils.log(`finished updating TransformedERC20 events`);
    };

    private async _getStartBlockAsync(eventName: string, startBlock: number, connection: Connection, latestBlockWithOffset: number): Promise<number> {
        const queryResult = await connection.query(
            `SELECT last_processed_block_number FROM events.last_block_processed WHERE event_name = '${eventName}'`,
        );
    
        logUtils.log(queryResult);
        const lastKnownBlock = queryResult[0] || {last_processed_block_number: startBlock};

        return Math.min(Number(lastKnownBlock.last_processed_block_number) + 1, latestBlockWithOffset - START_BLOCK_OFFSET);
    }

    private async _deleteOverlapAndSaveTransformedERC20EventsAsync(
        connection: Connection,
        toSave: TransformedERC20Event[],
        contract: string,
        startBlock: number,
        endBlock: number,
        tableName: string,
        lastBlockProcessed: LastBlockProcessed,
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();
    
        await queryRunner.connect();
    
        await queryRunner.startTransaction();
        try {
            
            // delete events scraped prior to the most recent block range
            await queryRunner.manager.query(`DELETE FROM events.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND contract_address = '${contract}'`);
            await queryRunner.manager.save(toSave);
            await queryRunner.manager.save(lastBlockProcessed);
            
            // commit transaction now:
            await queryRunner.commitTransaction();
            
        } catch (err) {
            
            logUtils.log(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
            
        } finally {
            
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
};
