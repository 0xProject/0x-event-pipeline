import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';

import { RawLogEntry } from 'ethereum-types';

import { Web3Source, LogPullInfo, ContractCallInfo } from '../../data_sources/web3';

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
                web3Source,
                parsedLogs,
                startBlock,
                endBlock,
                eventName,
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
            `SELECT last_processed_block_number FROM events_bsc.last_block_processed WHERE event_name = '${eventName}'`,
        );

        logUtils.log(queryResult);
        const lastKnownBlock = queryResult[0] || {last_processed_block_number: defaultStartBlock};

        return Math.min(Number(lastKnownBlock.last_processed_block_number) + 1, latestBlockWithOffset - START_BLOCK_OFFSET);
    }

    private async _deleteOverlapAndSaveAsync<T>(
        connection: Connection,
        web3Source: Web3Source,
        toSave: T[],
        startBlock: number,
        endBlock: number,
        eventName: string,
        tableName: string,
        lastBlockProcessed: LastBlockProcessed,
        deleteOptions: DeleteOptions,
    ): Promise<void> {

        if (eventName==='PancakeVIPEvent' && toSave.length>0){

            for(var index in toSave)
            { 
                // logUtils.log(`Making Function Call for ${(toSave[index] as any).contractAddress} contracts' token info`)
                const contractCallToken0: ContractCallInfo = {
                    to: (toSave[index] as any).contractAddress,
                    data: '0x0dfe1681',
                };
                const token0 = await web3Source.callContractMethodsAsync([contractCallToken0]);
                // logUtils.log(`token0 returned ${token0}`);

                const contractCallToken1: ContractCallInfo = {
                    to: (toSave[index] as any).contractAddress,
                    data: '0xd21220a7',
                };
    
                const token1 = await web3Source.callContractMethodsAsync([contractCallToken1]);
                // logUtils.log(`token1 returned ${token1}`);
                
                // logUtils.log(`(toSave[index] as any).fromToken ${(toSave[index] as any).fromToken}`);
                // logUtils.log(`(toSave[index] as any).toToken ${(toSave[index] as any).toToken}`);

                (toSave[index] as any).fromToken = ((toSave[index] as any).fromToken === '0') ? String(token0): String(token1);
                (toSave[index] as any).toToken = ((toSave[index] as any).toToken === '0' )? String(token0): String(token1);
                
                // logUtils.log(`assigned fromToken ${(toSave[index] as any).fromToken}`);
                // logUtils.log(`assigned toToken ${(toSave[index] as any).toToken} \n`);


            }

            
            const queryRunner = connection.createQueryRunner();

            let deleteQuery: string;
            if (deleteOptions.isDirectTrade && deleteOptions.directProtocol != undefined) {
                deleteQuery = `DELETE FROM events_bsc.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND direct_protocol = '${deleteOptions.directProtocol}'`;
            } else {
                if (tableName === 'native_fills' && deleteOptions.protocolVersion != undefined )
                {
                if (deleteOptions.protocolVersion === 'v4' && deleteOptions.nativeOrderType != undefined )
                {
                    deleteQuery = `DELETE FROM events_bsc.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND protocol_version = '${deleteOptions.protocolVersion}' AND native_order_type = '${deleteOptions.nativeOrderType}' `;
                } else {
                    deleteQuery = `DELETE FROM events_bsc.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND protocol_version = '${deleteOptions.protocolVersion}'`;
                }
                } else {
                deleteQuery = `DELETE FROM events_bsc.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock}`;
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

        } else {

            const queryRunner = connection.createQueryRunner();

            let deleteQuery: string;
            if (deleteOptions.isDirectTrade && deleteOptions.directProtocol != undefined) {
                deleteQuery = `DELETE FROM events_bsc.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND direct_protocol = '${deleteOptions.directProtocol}'`;
            } else {
                if (tableName === 'native_fills' && deleteOptions.protocolVersion != undefined )
                {
                if (deleteOptions.protocolVersion === 'v4' && deleteOptions.nativeOrderType != undefined )
                {
                    deleteQuery = `DELETE FROM events_bsc.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND protocol_version = '${deleteOptions.protocolVersion}' AND native_order_type = '${deleteOptions.nativeOrderType}' `;
                } else {
                    deleteQuery = `DELETE FROM events_bsc.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND protocol_version = '${deleteOptions.protocolVersion}'`;
                }
                } else {
                deleteQuery = `DELETE FROM events_bsc.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock}`;
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
}
