import { CHAIN_NAME_LOWER, MAX_BLOCKS_REORG, MAX_BLOCKS_TO_SEARCH, RESCRAPE_BLOCKS, SCHEMA } from '../../config';
import { LogPullInfo, Web3Source } from '../../data_sources/events/web3';
import { Event } from '../../entities';
import { LastBlockProcessed } from '../../entities';
import { chunk, DeleteOptions, kafkaSendAsync, kafkaSendCommandAsync, logger } from '../../utils';
import { SCAN_END_BLOCK, RPC_LOGS_ERROR, SCAN_RESULTS, SCAN_START_BLOCK, SKIPPED_EVENTS } from '../../utils/metrics';
import { TokenMetadataMap, extractTokensFromLogs, getParseSaveTokensAsync } from './web3_utils';
import { BlockWithoutTransactionData } from 'ethereum-types';
import { LogEntry } from 'ethereum-types';
import { Producer } from 'kafkajs';
import { Connection, QueryFailedError } from 'typeorm';

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
        contractAddress: string | null,
        startSearchBlock: number,
        parser: (decodedLog: LogEntry) => Event,
        deleteOptions?: DeleteOptions,
        tokenMetadataMap?: TokenMetadataMap,
        callback?: (event: Event) => void,
        filterFunction?: (events: Event[], web3Source: Web3Source) => Promise<Event[]>,
    ): Promise<string[]> {
        let startBlockResponse;
        try {
            startBlockResponse = await getStartBlockAsync(
                eventName,
                connection,
                web3Source,
                currentBlock,
                startSearchBlock,
            );
        } catch (err) {
            logger.error(`${err}, trying next time`);
            return [];
        }
        const { startBlockNumber, hasLatestBlockChanged, reorgLikely } = startBlockResponse;
        if (!hasLatestBlockChanged) {
            logger.debug(`No new blocks to scan for ${eventName}, skipping`);
            return [];
        }

        const endBlockNumber = Math.min(currentBlock.number!, startBlockNumber + (MAX_BLOCKS_TO_SEARCH - 1));
        let endBlockHash: string | null = '';
        try {
            endBlockHash =
                endBlockNumber === currentBlock.number
                    ? currentBlock.hash
                    : (await web3Source.getBlockInfoAsync(endBlockNumber)).hash;
        } catch (err) {
            logger.error(`${err}, trying next time`);
            return [];
        }

        if (reorgLikely) {
            logger.info(`A reorg probably happened, rescraping blocks ${startBlockNumber} to ${endBlockNumber}`);
        }

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
                startBlockNumber,
                endBlockNumber,
                endBlockHash!,
                reorgLikely,
                'event-by-topic',
                true,
                deleteOptions,
                tokenMetadataMap,
                callback,
                filterFunction,
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
        contractAddress: string | null,
        startSearchBlock: number,
        parser: (decodedLog: LogEntry) => Event,
        startBlockNumber: number,
        deleteOptions?: DeleteOptions,
        tokenMetadataMap?: TokenMetadataMap,
        callback?: (event: Event) => void,
        filterFunction?: (events: Event[], web3Source: Web3Source) => Promise<Event[]>,
    ): Promise<BackfillEventsResponse> {
        const endBlockNumber = Math.min(
            currentBlock.number! - MAX_BLOCKS_REORG,
            startBlockNumber + (MAX_BLOCKS_TO_SEARCH - 1),
        );

        let endBlockHash = null;
        try {
            endBlockHash = (await web3Source.getBlockInfoAsync(endBlockNumber)).hash;
        } catch (err) {
            logger.error(`${err}, trying next time`);
            return { transactionHashes: [], startBlockNumber: null, endBlockNumber: null };
        }

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
            startBlockNumber,
            endBlockNumber,
            endBlockHash!,
            true,
            'event-by-topic-backfill',
            false,
            deleteOptions,
            tokenMetadataMap,
            callback,
            filterFunction,
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
        contractAddress: string | null,
        startSearchBlock: number,
        parser: (decodedLog: LogEntry) => Event,
        startBlockNumber: number,
        endBlockNumber: number,
        endBlockHash: string,
        isBackfill: boolean,
        scrapingType: string,
        updateLastBlockProcessed: boolean,
        deleteOptions?: DeleteOptions,
        tokenMetadataMap?: TokenMetadataMap,
        callback?: (event: Event) => void,
        filterFunction?: (events: Event[], web3Source: Web3Source) => Promise<Event[]>,
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
                    const parsedLogsWithSkipped = rawLogs.logs.map((encodedLog: LogEntry) => parser(encodedLog));

                    const parsedLogs = parsedLogsWithSkipped.filter((log: Event) => log !== null);
                    SKIPPED_EVENTS.inc(
                        { type: scrapingType, event: eventName },
                        parsedLogsWithSkipped.length - parsedLogs.length,
                    );

                    const reorgedEvents = parsedLogs.filter((log: Event) => {
                        return log.blockNumber == endBlockNumber && log.blockHash != endBlockHash;
                    });
                    if (reorgedEvents.length > 0) {
                        logger.error(`Detected a reorg while scraping ${eventName}, near block ${endBlockNumber}`);
                        throw Error();
                    }

                    SCAN_RESULTS.labels({ type: scrapingType, event: eventName }).set(parsedLogs.length);

                    const filteredLogs = filterFunction ? await filterFunction(parsedLogs, web3Source) : parsedLogs;

                    // Get list of tx hashes
                    txHashes = filteredLogs.map((log: Event) => log.transactionHash);

                    // Get token metadata
                    const tokens = extractTokensFromLogs(filteredLogs, tokenMetadataMap);
                    await getParseSaveTokensAsync(connection, producer, web3Source, tokens);

                    logger.info(`Saving ${filteredLogs.length} ${eventName} events`);

                    await this._deleteOverlapAndSaveAsync(
                        connection,
                        producer,
                        filteredLogs,
                        startBlockNumber,
                        endBlockNumber,
                        eventName,
                        eventType,
                        tableName,
                        getLastBlockProcessedEntity(eventName, endBlockNumber, endBlockHash),
                        updateLastBlockProcessed,
                        isBackfill,
                        deleteOptions,
                    );
                }),
            );
            return { transactionHashes: txHashes, startBlockNumber, endBlockNumber };
        } catch (err) {
            logger.error(err);
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
        updateLastBlockProcessed: boolean,
        isBackfill: boolean,
        deleteOptions: DeleteOptions = {},
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        let deleteQuery = '';
        if (tableName === 'erc20_bridge_transfer_events') {
            if (deleteOptions.directFlag && deleteOptions.directProtocol != undefined) {
                deleteQuery = `DELETE FROM ${SCHEMA}.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock} AND direct_protocol IN ('${deleteOptions.directProtocol.join(
                    "','",
                )}')`;
            } else if (deleteOptions.directFlag === false) {
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

            const topic = `event-scraper.${CHAIN_NAME_LOWER}.events.${tableName.replace(/_/g, '-')}.v1`;

            if (isBackfill) {
                await kafkaSendCommandAsync(
                    producer,
                    topic,
                    [],
                    [
                        {
                            command: 'delete',
                            details: {
                                startBlockNumber: startBlock,
                                endBlockNumber: endBlock,
                                deleteOptions,
                            },
                        },
                    ],
                );
            }
            await kafkaSendAsync(producer, topic, ['transactionHash', 'logIndex'], toSave);
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
): Promise<{ startBlockNumber: number; hasLatestBlockChanged: boolean; reorgLikely: boolean }> => {
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
                startBlockNumber: min0(lastKnownBlockNumber - MAX_BLOCKS_REORG),
                hasLatestBlockChanged: true,
                reorgLikely: true,
            };
        }
        return {
            startBlockNumber: min0(lastKnownBlockNumber - (RESCRAPE_BLOCKS - 1)),
            hasLatestBlockChanged: true,
            reorgLikely: false,
        };
    }
    if (lastKnownBlock.block_hash !== currentBlock.hash) {
        return {
            startBlockNumber: min0(lastKnownBlockNumber - MAX_BLOCKS_REORG),
            hasLatestBlockChanged: true,
            reorgLikely: true,
        };
    }
    return {
        startBlockNumber: -1,
        hasLatestBlockChanged: false,
        reorgLikely: false,
    };
};

export function min0(num: number): number {
    if (num > 0) {
        return num;
    }
    return 0;
}

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
