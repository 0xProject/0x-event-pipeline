import { Producer } from 'kafkajs';
import { Connection, QueryFailedError } from 'typeorm';
import { hexToUtf8 } from 'web3-utils';
import { BlockWithoutTransactionData } from 'ethereum-types';

import { ContractCallInfo, LogPullInfo, Web3Source } from '../../data_sources/events/web3';
import { Event } from '../../entities';
import { chunk, kafkaSendAsync, logger } from '../../utils';
import { TokenMetadataMap, extractTokensFromLogs, getParseSaveTokensAsync } from './web3_utils';

import { RawLogEntry } from 'ethereum-types';

import { CHAIN_NAME_LOWER, MAX_BLOCKS_REORG, MAX_BLOCKS_TO_SEARCH, SCHEMA } from '../../config';
import { LastBlockProcessed } from '../../entities';
import { SCAN_END_BLOCK, RPC_LOGS_ERROR, SCAN_RESULTS, SCAN_START_BLOCK } from '../../utils/metrics';

export interface DeleteOptions {
    isDirectTrade?: boolean;
    directProtocol?: string[];
    protocolVersion?: string;
    nativeOrderType?: string;
    protocol?: string;
    recipient?: string;
}

export interface BackfillEventsResponse {
    transactionHashes: string[];
    startBlockNumber: number | null;
    endBlockNumber: number | null;
}

export class PullAndSaveEventsByTopic {
    public async getParseSaveEventsByTopic(
        connection: Connection,
        producer: Producer,
        web3Source: Web3Source,
        currentBlock: BlockWithoutTransactionData,
        eventName: string,
        eventType: any,
        tableName: string,
        topics: (string | null)[],
        contractAddress: string,
        startSearchBlock: number,
        parser: (decodedLog: RawLogEntry) => Event,
        deleteOptions: DeleteOptions,
        tokenMetadataMap: TokenMetadataMap = null,
    ): Promise<string[]> {
        const { startBlockNumber, hasLatestBlockChanged } = await getStartBlockAsync(
            eventName,
            connection,
            web3Source,
            currentBlock,
            startSearchBlock,
        );

        if (!hasLatestBlockChanged) {
            logger.debug(`No new blocks to scan for ${eventName}, skipping`);
            return [];
        }

        const endBlockNumber = Math.min(currentBlock.number!, startBlockNumber + (MAX_BLOCKS_TO_SEARCH - 1));
        const endBlockHash =
            endBlockNumber === currentBlock.number
                ? currentBlock.hash
                : (await web3Source.getBlockInfoAsync(endBlockNumber)).hash;

        return (
            await this._getParseSaveEventsByTopic(
                connection,
                producer,
                web3Source,
                currentBlock,
                eventName,
                eventType,
                tableName,
                topics,
                contractAddress,
                startSearchBlock,
                parser,
                deleteOptions,
                tokenMetadataMap,
                startBlockNumber,
                endBlockNumber,
                endBlockHash!,
                'event-by-topic',
                true,
            )
        ).transactionHashes;
    }

    public async getParseSaveEventsByTopicBackfill(
        connection: Connection,
        producer: Producer,
        web3Source: Web3Source,
        currentBlock: BlockWithoutTransactionData,
        eventName: string,
        eventType: any,
        tableName: string,
        topics: (string | null)[],
        contractAddress: string,
        startSearchBlock: number,
        parser: (decodedLog: RawLogEntry) => Event,
        deleteOptions: DeleteOptions,
        tokenMetadataMap: TokenMetadataMap = null,
        startBlockNumber: number,
    ): Promise<BackfillEventsResponse> {
        const endBlockNumber = Math.min(
            currentBlock.number! - MAX_BLOCKS_REORG,
            startBlockNumber + (MAX_BLOCKS_TO_SEARCH - 1),
        );
        const endBlockHash = (await web3Source.getBlockInfoAsync(endBlockNumber)).hash;

        return this._getParseSaveEventsByTopic(
            connection,
            producer,
            web3Source,
            currentBlock,
            eventName,
            eventType,
            tableName,
            topics,
            contractAddress,
            startSearchBlock,
            parser,
            deleteOptions,
            tokenMetadataMap,
            startBlockNumber,
            endBlockNumber,
            endBlockHash!,
            'event-by-topic-backfill',
            false,
        );
    }

    private async _getParseSaveEventsByTopic(
        connection: Connection,
        producer: Producer,
        web3Source: Web3Source,
        currentBlock: BlockWithoutTransactionData,
        eventName: string,
        eventType: any,
        tableName: string,
        topics: (string | null)[],
        contractAddress: string,
        startSearchBlock: number,
        parser: (decodedLog: RawLogEntry) => Event,
        deleteOptions: DeleteOptions,
        tokenMetadataMap: TokenMetadataMap = null,
        startBlockNumber: number,
        endBlockNumber: number,
        endBlockHash: string,
        scrapingType: string,
        updateLastBlockProcessed: boolean,
    ): Promise<BackfillEventsResponse> {
        logger.info(`Searching for ${eventName} between blocks ${startBlockNumber} and ${endBlockNumber}`);

        SCAN_START_BLOCK.labels({ type: scrapingType, event: eventName }).set(startBlockNumber);
        SCAN_END_BLOCK.labels({ type: scrapingType, event: eventName }).set(endBlockNumber);

        // assert(topics.length === 1);

        const logPullInfo: LogPullInfo = {
            address: contractAddress,
            fromBlock: startBlockNumber,
            toBlock: endBlockNumber,
            topics,
        };

        try {
            const rawLogsArray = await web3Source.getBatchLogInfoForContractsAsync([logPullInfo]);

            let txHashes: string[] = [];
            await Promise.all(
                rawLogsArray.map(async (rawLogs) => {
                    const parsedLogs = rawLogs.logs.map((encodedLog: RawLogEntry) => parser(encodedLog));

                    const reorgedEvents = parsedLogs.filter((log: Event) => {
                        return !(log.blockNumber == endBlockNumber && log.blockHash == endBlockHash);
                    });
                    if (reorgedEvents.length > 0) {
                        throw Error(`Detected a reorg while scraping ${eventName}, near block ${endBlockNumber}`);
                    }

                    if (eventName === 'VIPSwapEvent' && parsedLogs.length > 0) {
                        const contractCallToken0Array = [];
                        const contractCallToken1Array = [];

                        const contractCallProtocolNameArray = [];

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

                            const contractCallProtocolName: ContractCallInfo = {
                                to: contract_address,
                                data: '0x06fdde03',
                            };
                            contractCallProtocolNameArray.push(contractCallProtocolName);
                        }

                        const token0 = await web3Source.callContractMethodsAsync(contractCallToken0Array);
                        const token1 = await web3Source.callContractMethodsAsync(contractCallToken1Array);
                        const protocolName = await web3Source.callContractMethodsAsync(contractCallProtocolNameArray);

                        for (let i = 0; i < parsedLogs.length; i++) {
                            const token0_i = '0x' + token0[i].slice(2).slice(token0[i].length == 66 ? 64 - 40 : 0);
                            const token1_i = '0x' + token1[i].slice(2).slice(token1[i].length == 66 ? 64 - 40 : 0);
                            parsedLogs[i].fromToken = parsedLogs[i].fromToken === '0' ? token0_i : token1_i;
                            parsedLogs[i].toToken = parsedLogs[i].toToken === '0' ? token0_i : token1_i;

                            const protocolName_i = hexToUtf8('0x' + protocolName[i].slice(98))
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
                        }
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

                    SCAN_RESULTS.labels({ type: scrapingType, event: eventName }).set(parsedLogs.length);

                    // Get list of tx hashes
                    txHashes = parsedLogs.map((log: Event) => log.transactionHash);

                    // Get token metadata
                    const tokens = extractTokensFromLogs(parsedLogs, tokenMetadataMap);
                    await getParseSaveTokensAsync(connection, producer, web3Source, tokens);

                    logger.info(`Saving ${parsedLogs.length} ${eventName} events`);

                    await this._deleteOverlapAndSaveAsync(
                        connection,
                        producer,
                        parsedLogs,
                        startBlockNumber,
                        endBlockNumber,
                        eventName,
                        eventType,
                        tableName,
                        getLastBlockProcessedEntity(eventName, endBlockNumber, endBlockHash),
                        deleteOptions,
                        updateLastBlockProcessed,
                    );
                }),
            );
            return { transactionHashes: txHashes, startBlockNumber, endBlockNumber };
        } catch (err) {
            logger.error(`Failed to get logs for ${eventName}, retrying next time`);
            RPC_LOGS_ERROR.inc({ type: scrapingType, event: eventName });
            return { transactionHashes: [], startBlockNumber: null, endBlockNumber: null };
        }
    }
    private async _deleteOverlapAndSaveAsync(
        connection: Connection,
        producer: Producer,
        toSave: Event[],
        startBlock: number,
        endBlock: number,
        eventName: string,
        eventType: any,
        tableName: string,
        lastBlockProcessed: LastBlockProcessed,
        deleteOptions: DeleteOptions,
        updateLastBlockProcessed: boolean,
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
        } else if (tableName === 'uniswap_v2_pair_created_events') {
            deleteQuery = `DELETE FROM ${SCHEMA}.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND protocol = '${deleteOptions.protocol}'`;
        } else if (tableName === 'log_transfer_events') {
            deleteQuery = `DELETE FROM ${SCHEMA}.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND "to" = '${deleteOptions.recipient}'`;
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
            if (updateLastBlockProcessed) {
                await queryRunner.manager.save(lastBlockProcessed);
            }
            // commit transaction now:
            await queryRunner.commitTransaction();

            await kafkaSendAsync(
                producer,
                `event-scraper.${CHAIN_NAME_LOWER}.events.${tableName.replace(/_/g, '-')}.v0`,
                ['transactionHash', 'logIndex'],
                toSave,
            );
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
    web3Source: Web3Source,
    currentBlock: BlockWithoutTransactionData,
    defaultStartBlock: number,
): Promise<{ startBlockNumber: number; hasLatestBlockChanged: boolean }> => {
    const queryResult = await connection.query(
        `SELECT last_processed_block_number, block_hash FROM ${SCHEMA}.last_block_processed WHERE event_name = '${eventName}'`,
    );

    const lastKnownBlock = queryResult[0] || { last_processed_block_number: defaultStartBlock, block_hash: null };

    const lastKnownBlockNumber = Number(lastKnownBlock.last_processed_block_number);

    const hasLatestBlockIncreased = lastKnownBlockNumber !== currentBlock.number;

    if (hasLatestBlockIncreased) {
        const lastKnownBlockFresh = await web3Source.getBlockInfoAsync(lastKnownBlockNumber);

        if (lastKnownBlock.block_hash !== lastKnownBlockFresh.hash) {
            return {
                startBlockNumber: lastKnownBlockNumber - MAX_BLOCKS_REORG,
                hasLatestBlockChanged: true,
            };
        }
        return {
            startBlockNumber: lastKnownBlockNumber + 1,
            hasLatestBlockChanged: true,
        };
    }
    if (lastKnownBlock.block_hash !== currentBlock.hash) {
        return {
            startBlockNumber: lastKnownBlockNumber - MAX_BLOCKS_REORG,
            hasLatestBlockChanged: true,
        };
    }
    return {
        startBlockNumber: -1,
        hasLatestBlockChanged: false,
    };
};

export const getLastBlockProcessedEntity = (
    eventName: string,
    endBlockNumber: number,
    endBlockHash: string,
): LastBlockProcessed => {
    const lastBlockProcessed = new LastBlockProcessed();
    lastBlockProcessed.eventName = eventName;
    lastBlockProcessed.lastProcessedBlockNumber = endBlockNumber;
    lastBlockProcessed.processedTimestamp = new Date().getTime();
    lastBlockProcessed.blockHash = endBlockHash;
    return lastBlockProcessed;
};
