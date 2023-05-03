import { ContractCallInfo, LogPullInfo, Web3Source } from '../../data_sources/events/web3';
import { Event } from '../../entities';
import { chunk, logger } from '../../utils';
import { TokenMetadataMap, extractTokensFromLogs, getParseSaveTokensAsync } from './web3_utils';

import { Connection, QueryFailedError } from 'typeorm';

import { RawLogEntry } from 'ethereum-types';

import { MAX_BLOCKS_TO_SEARCH, SCHEMA, START_BLOCK_OFFSET } from '../../config';
import { LastBlockProcessed, Pool } from '../../entities';

import { SCAN_END_BLOCK, SCAN_RESULTS, SCAN_START_BLOCK } from '../../utils/metrics';
import { hexToUtf8 } from 'web3-utils';

export interface DeleteOptions {
    isDirectTrade?: boolean;
    directProtocol?: string[];
    protocolVersion?: string;
    nativeOrderType?: string;
}

export interface Pool {
    observed_timestamp: number;
    contract_address: string;
    token0: string;
    token1: string;
    protocol_name: string;
}

export class PullAndSaveEventsByTopic {
    public async getParseSaveEventsByTopic<EVENT>(
        connection: Connection,
        web3Source: Web3Source,
        latestBlockWithOffset: number,
        eventName: string,
        eventType: any,
        tableName: string,
        topics: (string | null)[],
        contractAddress: string,
        startSearchBlock: number,
        parser: (decodedLog: RawLogEntry) => EVENT,
        deleteOptions: DeleteOptions,
        tokenMetadataMap: TokenMetadataMap = null,
    ): Promise<string[]> {

        const startBlock = await getStartBlockAsync(eventName, connection, latestBlockWithOffset, startSearchBlock);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_SEARCH - 1));

        logger.info(`Searching for ${eventName} between blocks ${startBlock} and ${endBlock}`);

        SCAN_START_BLOCK.labels({ type: 'event-by-topic', event: eventName }).set(startBlock);
        SCAN_END_BLOCK.labels({ type: 'event-by-topic', event: eventName }).set(endBlock);

        // assert(topics.length === 1);

        const logPullInfo: LogPullInfo = {
            address: contractAddress,
            fromBlock: startBlock,
            toBlock: endBlock,
            topics,
        };

        const rawLogsArray = await web3Source.getBatchLogInfoForContractsAsync([logPullInfo]);

        let txHashes: string[] = [];
        await Promise.all(
            rawLogsArray.map(async (rawLogs) => {
                const parsedLogs = rawLogs.logs.map((encodedLog: RawLogEntry) => parser(encodedLog));

                if (eventName === 'VIPSwapEvent' && parsedLogs.length > 0) {

                    const token0Array = Array(parsedLogs.length);
                    const token1Array = Array(parsedLogs.length);
                    const protocolNameArray = Array(parsedLogs.length);

                    // TODO: STEP 1 check if not save

                    // STEP 2 create a migration
                    // migration: create a new table events.uniswap_topics with column address, token0, token1, protocol_name

                    // TODO: wrap in functions

                    const contractCallToken0Array = [];
                    const contractCallToken1Array = [];
                    const contractCallProtocolNameArray = [];
                    const index_track = [];
                    const contractCallAddressArray = [];

                    for (let i = 0; i < parsedLogs.length; i++) {
                        const contract_address: string = parsedLogs[i].contractAddress;
                        const address_check = await connection.query(
                            `SELECT address FROM events.uniswap_topics WHERE address = '${contract_address}'`,
                        );
                        
                        if (address_check.length > 0) {
                            const Savedtoken0 = await connection.query(
                                `SELECT token0 FROM events.uniswap_topics WHERE address = '${contract_address}'`,
                            );
                            token0Array[i] = Savedtoken0

                            const Savedtoken1 = await connection.query(
                                `SELECT token1 FROM events.uniswap_topics WHERE address = '${contract_address}'`,
                            );
                            token1Array[i] = Savedtoken1

                            const SavedprotocolName = await connection.query(
                                `SELECT protocol_name FROM events.uniswap_topics WHERE address = '${contract_address}'`,
                            );
                            protocolNameArray[i] = SavedprotocolName

                            parsedLogs[i].fromToken = parsedLogs[i].fromToken === '0' ? Savedtoken0 : Savedtoken1;
                            parsedLogs[i].toToken = parsedLogs[i].toToken === '0' ? Savedtoken0 : Savedtoken1;
    
                            // Legacy compatibility
                            if (SavedprotocolName === 'Uniswap') {
                                parsedLogs[i].from = 'UniswapV2';
                                parsedLogs[i].directProtocol = 'UniswapV2';
                            } else {
                                parsedLogs[i].from = SavedprotocolName.includes('Swap')
                                    ? SavedprotocolName
                                    : SavedprotocolName + 'Swap';
                                parsedLogs[i].directProtocol = SavedprotocolName.includes('Swap')
                                    ? SavedprotocolName
                                    : SavedprotocolName + 'Swap';
                            }
                        }

                        else {
                            index_track.push(i)

                            const contractCallToken0: ContractCallInfo = {
                                to: contract_address,
                                data: '0x0dfe1681',
                            };
                            contractCallToken0Array.push(contractCallToken0);
    
                            const contractCallToken1: ContractCallInfo = {
                                to: contract_address,
                                data: '0xd21220a7',
                            };
                            contractCallToken1Array.push(contractCallToken1);
    
                            const contractCallProtocolName: ContractCallInfo = {
                                to: contract_address,
                                data: '0x06fdde03',
                            };
                            contractCallProtocolNameArray.push(contractCallProtocolName);

                            contractCallAddressArray.push(contract_address)
                        }
                    }

                    const token0CallRes = await web3Source.callContractMethodsAsync(contractCallToken0Array);
                    const token1CallRes = await web3Source.callContractMethodsAsync(contractCallToken1Array);
                    const protocolNameCallRes = await web3Source.callContractMethodsAsync(contractCallProtocolNameArray);
                    const rawTopics = []

                    for (let j = 0; j < index_track.length; j++) {
                            const i = index_track[j]
                            // token0Array[i] = 
                            // token1Array[i] = 
                            // protocolNameArray[i] = 

                            const token0_i = '0x' + token0CallRes[j].slice(2).slice(token0CallRes[j].length == 66 ? 64 - 40 : 0);
                            const token1_i = '0x' + token1CallRes[j].slice(2).slice(token1CallRes[j].length == 66 ? 64 - 40 : 0);
                            parsedLogs[i].fromToken = parsedLogs[i].fromToken === '0' ? token0_i : token1_i;
                            parsedLogs[i].toToken = parsedLogs[i].toToken === '0' ? token0_i : token1_i;
    
                            const protocolName_i = hexToUtf8('0x' + protocolNameCallRes[j].slice(98))
                                .split('LP')[0]
                                .split(' ')[0]
                                .slice(1);

                            // Legacy compatibility
                            if (protocolName_i === 'Uniswap') {
                                parsedLogs[i].from = 'UniswapV2';
                                parsedLogs[i].directProtocol = 'UniswapV2';
                            } else {
                                parsedLogs[i].from = protocolName_i.includes('Swap')
                                    ? protocolName_i
                                    : protocolName_i + 'Swap';
                                parsedLogs[i].directProtocol = protocolName_i.includes('Swap')
                                    ? protocolName_i
                                    : protocolName_i + 'Swap';
                            }

                            const raw_topic: Pool = {
                                observed_timestamp: new Date().getTime(),
                                contract_address: contractCallAddressArray[j],
                                token0: token0_i,
                                token1: token1_i,
                                protocol_name: protocolName_i,
                            }
                            rawTopics.push(raw_topic)
                    }

                    // save transformed topic data to db
                    await this._saveTopicsAsync(connection, rawTopics);

                    // if (contractCallToken0Array.length > 0) {
                    //     token0.push(await web3Source.callContractMethodsAsync(contractCallToken0Array));
                    //     token1.push(await web3Source.callContractMethodsAsync(contractCallToken1Array));
                    //     protocolName.push(await web3Source.callContractMethodsAsync(contractCallProtocolNameArray));
                    // }

                    // if (SavedToken0Array.length > 0) {
                    //     token0.push(SavedToken0Array);
                    //     token1.push(SavedToken1Array);
                    //     protocolName.push(SavedProtocolNameArray);
                    // }

                    // for (const index in parsedLogs) {
                    //     const contract_address: string = (parsedLogs[index] as any).contractAddress;
                    //     console.log("index", index)
                    //     console.log(parsedLogs[index])

                    //     const contractCallToken0: ContractCallInfo = {
                    //         to: contract_address,
                    //         data: '0x0dfe1681',
                    //     };
                    //     contractCallToken0Array.push(contractCallToken0);

                    //     const contractCallToken1: ContractCallInfo = {
                    //         to: contract_address,
                    //         data: '0xd21220a7',
                    //     };
                    //     contractCallToken1Array.push(contractCallToken1);

                    //     const contractCallProtocolName: ContractCallInfo = {
                    //         to: contract_address,
                    //         data: '0x06fdde03',
                    //     };
                    //     contractCallProtocolNameArray.push(contractCallProtocolName);
                    // }

                    // const token0 = await web3Source.callContractMethodsAsync(contractCallToken0Array);
                    // const token1 = await web3Source.callContractMethodsAsync(contractCallToken1Array);
                    // const protocolName = await web3Source.callContractMethodsAsync(contractCallProtocolNameArray);

                    // for (let i = 0; i < parsedLogs.length; i++) {
                    //     const token0_i = '0x' + token0[i].slice(2).slice(token0[i].length == 66 ? 64 - 40 : 0);
                    //     const token1_i = '0x' + token1[i].slice(2).slice(token1[i].length == 66 ? 64 - 40 : 0);
                    //     parsedLogs[i].fromToken = parsedLogs[i].fromToken === '0' ? token0_i : token1_i;
                    //     parsedLogs[i].toToken = parsedLogs[i].toToken === '0' ? token0_i : token1_i;

                    //     const protocolName_i = hexToUtf8('0x' + protocolName[i].slice(98))
                    //         .split('LP')[0]
                    //         .split(' ')[0]
                    //         .slice(1);

                    //     // Legacy compatibility
                    //     if (protocolName_i === 'Uniswap') {
                    //         parsedLogs[i].from = 'UniswapV2';
                    //         parsedLogs[i].directProtocol = 'UniswapV2';
                    //     } else {
                    //         parsedLogs[i].from = protocolName_i.includes('Swap')
                    //             ? protocolName_i
                    //             : protocolName_i + 'Swap';
                    //         parsedLogs[i].directProtocol = protocolName_i.includes('Swap')
                    //             ? protocolName_i
                    //             : protocolName_i + 'Swap';
                    //     }
                    // }
                }

                if (eventName === 'UniswapV3VIPEvent' && parsedLogs.length > 0) {
                    const contractCallToken0Array = [];
                    const contractCallToken1Array = [];

                    for (const index in parsedLogs) {
                        const contract_address: string = (parsedLogs[index] as any).contractAddress;

                        const contractCallToken0: ContractCallInfo = {
                            to: contract_address,
                            data: '0x0dfe1681',
                        };
                        contractCallToken0Array.push(contractCallToken0);

                        const contractCallToken1: ContractCallInfo = {
                            to: contract_address,
                            data: '0xd21220a7',
                        };
                        contractCallToken1Array.push(contractCallToken1);
                    }
                    const token0 = await web3Source.callContractMethodsAsync(contractCallToken0Array);
                    const token1 = await web3Source.callContractMethodsAsync(contractCallToken1Array);

                    for (let i = 0; i < parsedLogs.length; i++) {
                        const token0_i = '0x' + token0[i].slice(2).slice(token0[i].length == 66 ? 64 - 40 : 0);
                        const token1_i = '0x' + token1[i].slice(2).slice(token1[i].length == 66 ? 64 - 40 : 0);
                        parsedLogs[i].fromToken = parsedLogs[i].fromToken === '0' ? token0_i : token1_i;
                        parsedLogs[i].toToken = parsedLogs[i].toToken === '0' ? token0_i : token1_i;
                    }
                }

                SCAN_RESULTS.labels({ type: 'event-by-topic', event: eventName }).set(parsedLogs.length);

                // Get list of tx hashes
                txHashes = parsedLogs.map((log: Event) => log.transactionHash);

                // Get token metadata
                const tokens = extractTokensFromLogs(parsedLogs, tokenMetadataMap);
                await getParseSaveTokensAsync(connection, web3Source, tokens);

                logger.info(`Saving ${parsedLogs.length} ${eventName} events`);

                await this._deleteOverlapAndSaveAsync<EVENT>(
                    connection,
                    parsedLogs,
                    startBlock,
                    endBlock,
                    eventName,
                    eventType,
                    tableName,
                    getLastBlockProcessedEntity(eventName, endBlock),
                    deleteOptions,
                );
            }),
        );
        return txHashes;
    }

    private async _saveTopicsAsync(
        connection: Connection,
        toSave: Pool[],
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            for (const chunkItems of chunk(toSave, 300)) {
                await queryRunner.manager.insert(Pool, chunkItems);
            }

            // commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            logger.error(err);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async _deleteOverlapAndSaveAsync<EVENT>(
        connection: Connection,
        toSave: EVENT[],
        startBlock: number,
        endBlock: number,
        eventName: string,
        eventType: any,
        tableName: string,
        lastBlockProcessed: LastBlockProcessed,
        deleteOptions: DeleteOptions,
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        let deleteQuery = '';
        if (tableName === 'erc20_bridge_transfer_events') {
            if (deleteOptions.isDirectTrade && deleteOptions.directProtocol != undefined) {
                deleteQuery = `DELETE FROM ${SCHEMA}.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND direct_protocol IN ('${deleteOptions.directProtocol.join(
                    "','",
                )}')`;
            } else if (deleteOptions.isDirectTrade === false) {
                deleteQuery = `DELETE FROM ${SCHEMA}.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND direct_flag = FALSE`;
            }
        } else if (tableName === 'native_fills' && deleteOptions.protocolVersion != undefined) {
            if (deleteOptions.protocolVersion === 'v4' && deleteOptions.nativeOrderType != undefined) {
                deleteQuery = `DELETE FROM ${SCHEMA}.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND protocol_version = '${deleteOptions.protocolVersion}' AND native_order_type = '${deleteOptions.nativeOrderType}' `;
            } else {
                deleteQuery = `DELETE FROM ${SCHEMA}.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND protocol_version = '${deleteOptions.protocolVersion}'`;
            }
        } else {
            deleteQuery = `DELETE FROM ${SCHEMA}.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock}`;
        }

        await queryRunner.connect();

        await queryRunner.startTransaction('REPEATABLE READ');
        try {
            if (toSave.length > 0) {
                // delete events scraped prior to the most recent block range
                await queryRunner.manager.query(deleteQuery);

                for (const chunkItems of chunk(toSave, 300)) {
                    await queryRunner.manager.insert(eventType, chunkItems);
                }
            }
            await queryRunner.manager.save(lastBlockProcessed);

            // commit transaction now:
            await queryRunner.commitTransaction();
        } catch (err) {
            if (
                err instanceof QueryFailedError &&
                err.message === 'could not serialize access due to concurrent update'
            ) {
                logger.child({ event: eventName }).warn('Simultaneous write attempt, will retry on the next run');
            } else {
                logger.error(`Failed while saving ${eventName}`);
                logger.child({ event: eventName }).error(err);
            }
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}

export const getStartBlockAsync = async (
    eventName: string,
    connection: Connection,
    latestBlockWithOffset: number,
    defaultStartBlock: number,
): Promise<number> => {
    const queryResult = await connection.query(
        `SELECT last_processed_block_number FROM ${SCHEMA}.last_block_processed WHERE event_name = '${eventName}'`,
    );

    const lastKnownBlock = queryResult[0] || { last_processed_block_number: defaultStartBlock };

    return Math.min(Number(lastKnownBlock.last_processed_block_number) + 1, latestBlockWithOffset - START_BLOCK_OFFSET);
};

export const getLastBlockProcessedEntity = (eventName: string, endBlock: number): LastBlockProcessed => {
    const lastBlockProcessed = new LastBlockProcessed();
    lastBlockProcessed.eventName = eventName;
    lastBlockProcessed.lastProcessedBlockNumber = endBlock;
    lastBlockProcessed.processedTimestamp = new Date().getTime();
    return lastBlockProcessed;
};
