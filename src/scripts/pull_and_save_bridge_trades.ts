import { web3Factory } from '@0x/dev-utils';
import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';
import { Web3Source, LogPullInfo } from '../data_sources/web3';
import { calculateEndBlockAsync, lastBlockProcessedAsync } from './utils/shared_utils';

import { RawLogEntry } from 'ethereum-types';

import { ERC20BridgeTransferEvent, LastBlockProcessed } from '../entities';

import { ETHEREUM_RPC_URL, BRIDGE_CONTRACTS, BRIDGE_TRADE_TOPIC, START_BLOCK_OFFSET, MAX_BLOCKS_TO_SEARCH } from '../config';
import { parseErc20BridgeTransfer } from '../parsers/events/bridge_transfer_events';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});
const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);

export class BridgeTradeScraper {
    public async getParseSaveBridgeTradesAsync(connection: Connection): Promise<void> {
        logUtils.log(`pulling bridge trades`);

        const latestBlockWithOffset = await calculateEndBlockAsync(web3Source);

        const logPullInfos: LogPullInfo[] = await Promise.all(BRIDGE_CONTRACTS.map(async bridge => {
            const eventName = 'ERC20BridgeTransferEvent' + '-' + bridge.contract;

            const fromBlock = await this._getStartBlockAsync(eventName, bridge.startingBlock, connection, latestBlockWithOffset);
            const toBlock = Math.min(latestBlockWithOffset, fromBlock + (MAX_BLOCKS_TO_SEARCH - 1));
            const logPullInfo: LogPullInfo = {
                address: bridge.contract,
                fromBlock,
                toBlock,
                topics: BRIDGE_TRADE_TOPIC,
            }

            return logPullInfo;
        }));

        const rawLogsArray = await web3Source.getBatchLogInfoForContractsAsync(logPullInfos);

        rawLogsArray.map(async rawLogs => {
            const parsedLogs = rawLogs.logs.map((encodedLog: RawLogEntry) => parseErc20BridgeTransfer(encodedLog));

            logUtils.log(`Saving ${parsedLogs.length} bridge trades for contract ${rawLogs.logPull.address}`)

            const eventName = 'ERC20BridgeTransferEvent' + '-' + rawLogs.logPull.address;

            await this._deleteOverlapAndSaveBridgeEventsAsync(
                connection,
                parsedLogs,
                rawLogs.logPull.address,
                rawLogs.logPull.fromBlock,
                rawLogs.logPull.toBlock,
                'erc20_bridge_transfer_events',
                await lastBlockProcessedAsync(eventName, rawLogs.logPull.toBlock),
            );
        })
        
        logUtils.log(`finished updating bridge events`);

    };

    private async _getStartBlockAsync(eventName: string, startBlock: number, connection: Connection, latestBlockWithOffset: number): Promise<number> {
        const queryResult = await connection.query(
            `SELECT last_processed_block_number FROM events.last_block_processed WHERE event_name = '${eventName}'`,
        );
    
        logUtils.log(queryResult);
        const lastKnownBlock = queryResult[0] || {last_processed_block_number: startBlock};

        return Math.min(Number(lastKnownBlock.last_processed_block_number) + 1, latestBlockWithOffset - START_BLOCK_OFFSET);
    }

    private async _deleteOverlapAndSaveBridgeEventsAsync(
        connection: Connection,
        toSave: ERC20BridgeTransferEvent[],
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
