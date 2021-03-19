import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';

import { RawLogEntry } from 'ethereum-types';

import { Web3Source, LogPullInfo } from '../../data_sources/web3';

import { MAX_BLOCKS_TO_SEARCH, START_BLOCK_OFFSET } from '../../config';
import {
    LastBlockProcessed,
} from '../../entities';

export interface DeleteOptions {
  isDirectTrade ?: boolean,
  directProtocol ?: string,
  protocolVersion ?: string,
  nativeOrderType ?: string,

}

export class PullAndSaveEventsByTopic {

    public async getParseSaveEventsByTopic<EVENT>(
        connection: Connection,
        web3Source: Web3Source,
        latestBlockWithOffset: number,
        eventName: string,
        tableName: string,
        topics: string[],
        contractAddress: string,
        startSearchBlock: number,
        parser: ((decodedLog: RawLogEntry) => EVENT),
        deleteOptions: DeleteOptions,
        ): Promise<void> {

        const startBlock = await this._getStartBlockAsync(eventName, connection, latestBlockWithOffset, startSearchBlock);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));

        logUtils.log(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);

        // assert(topics.length === 1);

        const logPullInfo: LogPullInfo = {
            address: contractAddress,
            fromBlock: startBlock,
            toBlock: endBlock,
            topics,
        };

        const rawLogsArray = await web3Source.getBatchLogInfoForContractsAsync([logPullInfo]);

        await Promise.all(rawLogsArray.map(async rawLogs => {
            const parsedLogs = rawLogs.logs.map((encodedLog: RawLogEntry) => parser(encodedLog));

            logUtils.log(`Saving ${parsedLogs.length} ${eventName} events`)

            await this._deleteOverlapAndSaveAsync<EVENT>(
                connection,
                parsedLogs,
                startBlock,
                endBlock,
                tableName,
                await this._lastBlockProcessedAsync(eventName, endBlock),
                deleteOptions,
            );
        }));
    }

    private async _lastBlockProcessedAsync(eventName: string, endBlock: number): Promise<LastBlockProcessed> {
        const lastBlockProcessed = new LastBlockProcessed();
        lastBlockProcessed.eventName = eventName;
        lastBlockProcessed.lastProcessedBlockNumber = endBlock;
        lastBlockProcessed.processedTimestamp = new Date().getTime();
        return lastBlockProcessed;
    }

    private async _getStartBlockAsync(eventName: string, connection: Connection, latestBlockWithOffset: number, defaultStartBlock: number): Promise<number> {
        const queryResult = await connection.query(
            `SELECT last_processed_block_number FROM events.last_block_processed WHERE event_name = '${eventName}'`,
        );

        logUtils.log(queryResult);
        const lastKnownBlock = queryResult[0] || {last_processed_block_number: defaultStartBlock};

        return Math.min(Number(lastKnownBlock.last_processed_block_number) + 1, latestBlockWithOffset - START_BLOCK_OFFSET);
    }

    private async _deleteOverlapAndSaveAsync<T>(
        connection: Connection,
        toSave: T[],
        startBlock: number,
        endBlock: number,
        tableName: string,
        lastBlockProcessed: LastBlockProcessed,
        deleteOptions: DeleteOptions,
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        let deleteQuery: string;
        if (deleteOptions.isDirectTrade && deleteOptions.directProtocol != undefined) {
            deleteQuery = `DELETE FROM events.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND direct_protocol = '${deleteOptions.directProtocol}'`;
        } else {
            if (tableName === 'native_fills' && deleteOptions.protocolVersion != undefined )
            {
              if (deleteOptions.protocolVersion === 'v4' && deleteOptions.nativeOrderType != undefined )
              {
                deleteQuery = `DELETE FROM events.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND protocol_version = '${deleteOptions.protocolVersion}' AND native_order_type = '${deleteOptions.nativeOrderType}' `;
              } else {
                deleteQuery = `DELETE FROM events.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND protocol_version = '${deleteOptions.protocolVersion}'`;
              }
            } else {
              deleteQuery = `DELETE FROM events.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock}`;
            }
        }

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {

            // delete events scraped prior to the most recent block range
            await queryRunner.manager.query(deleteQuery);
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
}
