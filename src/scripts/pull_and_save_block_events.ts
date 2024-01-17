import {
    BLOCKS_REORG_CHECK_INCREMENT,
    CHAIN_NAME,
    EVM_RPC_URL,
    MAX_BLOCKS_REORG,
    MAX_BLOCKS_TO_PULL,
    FEAT_TOKENS_FROM_TRANSFERS,
    SCHEMA,
} from '../config';
import { TRANSFER_EVENT_TOPIC_0 } from '../constants';
import { Web3Source, BlockWithTransactionData1559 as EVMBlock } from '../data_sources/events/web3';
import {
    Transaction1559 as EVMTransaction,
    TransactionReceipt1559 as EVMTransactionReceipt,
} from '../data_sources/events/web3';
import { Block, Transaction, TransactionReceipt } from '../entities';
import { eventScrperProps, EventScraperProps } from '../events';
import { parseBlock, parseTransaction, parseTransactionReceipt } from '../parsers/web3/parse_web3_objects';
import { chunk, logger } from '../utils';
import { CURRENT_BLOCK, SCRIPT_RUN_DURATION } from '../utils/metrics';
import { contractTopicFilter } from './utils/block_utils';
import { getParseSaveTokensAsync } from './utils/web3_utils';
import { web3Factory } from '@0x/dev-utils';
import { LogEntry } from 'ethereum-types';
import { Producer } from 'kafkajs';
import { Connection, QueryFailedError, InsertResult } from 'typeorm';

interface FullTransaction extends EVMTransaction, EVMTransactionReceipt {
    blockHash: string;
    blockNumber: number;
    to: string;
    transactionIndex: number;
}

interface FullBlock extends EVMBlock {
    transactions: FullTransaction[];
}

interface TypedEvents {
    eventType: any;
    eventName: string;
    events: Event[];
}
interface ParsedFullBlock {
    parsedBlock: Block;
    parsedTransactions: Transaction[];
    parsedTransactionReceipts: TransactionReceipt[];
    parsedEvents: TypedEvents[];
}

interface ParsedTransaction {
    parsedTransaction: Transaction | null;
    parsedEvents: TypedEvents[] | null;
}

const provider = web3Factory.getRpcProvider({
    rpcUrl: EVM_RPC_URL,
});
const web3Source = new Web3Source(provider, EVM_RPC_URL);

function parseBlockTransactionsEvents(fullBlock: FullBlock): ParsedFullBlock {
    const parsedBlock = parseBlock({ ...fullBlock, transactions: [''] });

    const usefullTxs: ParsedTransaction[] = fullBlock.transactions
        .map((transaction: FullTransaction): ParsedTransaction | null => {
            const parsedTransactionEvents = parseTransactionEvents(transaction);

            if (parsedTransactionEvents.parsedTransaction !== null) {
                return parsedTransactionEvents;
            }
            return null;
        })
        .filter((tx) => tx !== null) as ParsedTransaction[];

    const parsedTransactions: Transaction[] = usefullTxs.map((tx) => tx!.parsedTransaction!);
    const parsedTransactionHashes: string[] = parsedTransactions.map((tx) => tx.transactionHash);

    const parsedTransactionReceipts: TransactionReceipt[] = fullBlock.transactions
        .filter((tx) => parsedTransactionHashes.includes(tx.hash))
        .map(parseTransactionReceipt);

    return {
        parsedBlock,
        parsedTransactions,
        parsedTransactionReceipts,
        parsedEvents: usefullTxs.map((tx) => tx!.parsedEvents!).flat(),
    };
}

function parseTransactionEvents(transaction: FullTransaction): ParsedTransaction {
    const parsedTransaction = parseTransaction(transaction);

    const nestedParsedEvents: TypedEvents[] = eventScrperProps.map((props: EventScraperProps): TypedEvents => {
        if (props.enabled) {
            const baseFilteredLogs = transaction.logs.filter((log) =>
                contractTopicFilter(props.contractAddress, props.topics, log),
            );
            if (baseFilteredLogs.length > 0) {
                const parsedLogs = baseFilteredLogs.map((log: LogEntry) => props.parser(log));

                const filteredLogs = props.filterFunction
                    ? props.filterFunction(parsedLogs, parsedTransaction)
                    : parsedLogs;

                const postProcessedLogs = props.postProcess ? props.postProcess(filteredLogs) : filteredLogs;

                return {
                    eventType: props.tType,
                    eventName: props.name,
                    events: postProcessedLogs,
                };
            }
        }
        return {
            eventType: props.tType,
            eventName: props.name,
            events: [],
        };
    });

    return {
        parsedTransaction: nestedParsedEvents.map((npe) => npe.events).flat().length > 0 ? parsedTransaction : null,
        parsedEvents: nestedParsedEvents,
    };
}

type range = {
    start: number;
    end: number;
};

function findRanges(nums: number[]): range[] {
    const sorted = [...new Set(nums)].sort();
    const ranges: { start: number; end: number }[] = [];
    const currentRange = { start: sorted[0], end: sorted[0] };
    for (let i = 1; i < sorted.length; i++) {
        if (currentRange.end + 1 === sorted[i]) {
            currentRange.end = sorted[i];
        } else {
            ranges.push(currentRange);
            currentRange.start = sorted[i];
            currentRange.end = sorted[i];
        }
    }
    ranges.push(currentRange);
    return ranges;
}

async function saveFullBlocks(connection: Connection, eventTables: string[], parsedFullBlocks: ParsedFullBlock[]) {
    const parsedBlocks = parsedFullBlocks.map((block) => block.parsedBlock);
    const parsedTransactions = parsedFullBlocks.map((block) => block.parsedTransactions).flat();
    const parsedTransactionReceipts = parsedFullBlocks.map((block) => block.parsedTransactionReceipts).flat();

    const parsedEvents = parsedFullBlocks.map((block) => block.parsedEvents).flat();

    const parsedEventsByType = Object.values(
        parsedEvents.reduce((accumulator, typedEvents): { [id: string]: TypedEvents } => {
            if (accumulator[typedEvents.eventName] === undefined) {
                accumulator[typedEvents.eventName] = typedEvents;
            } else {
                accumulator[typedEvents.eventName].events = accumulator[typedEvents.eventName].events.concat(
                    typedEvents.events,
                );
            }
            return accumulator;
        }, {} as { [id: string]: TypedEvents }),
    ).filter((typedEvents) => typedEvents.events.length > 0);

    const blockRanges = findRanges(parsedBlocks.map((block) => block.blockNumber));

    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    try {
        await queryRunner.startTransaction('REPEATABLE READ');

        // Delete
        const tablesToDelete = ['blocks', 'transactions', 'transaction_receipts'].concat(eventTables);

        const deletePromises: Promise<InsertResult>[] = [];
        tablesToDelete.forEach(async (tableName) => {
            blockRanges.forEach(async (blockRange) => {
                deletePromises.push(
                    queryRunner.manager.query(
                        `DELETE FROM ${SCHEMA}.${tableName}
                     WHERE
                       block_number >= ${blockRange.start} AND
                       block_number <= ${blockRange.end}`,
                    ),
                );
            });
        });

        await Promise.all(deletePromises);

        // Insert

        const promises: Promise<InsertResult>[] = [];
        /// Blocks
        for (const chunkItems of chunk(parsedBlocks, 300)) {
            promises.push(queryRunner.manager.insert(Block, chunkItems));
        }

        /// Transactions
        for (const chunkItems of chunk(parsedTransactions, 300)) {
            promises.push(queryRunner.manager.insert(Transaction, chunkItems));
        }

        /// TransactionReceipts
        for (const chunkItems of chunk(parsedTransactionReceipts, 300)) {
            promises.push(queryRunner.manager.insert(TransactionReceipt, chunkItems));
        }

        /// Events
        parsedEventsByType.forEach(async (typedEvents: TypedEvents) => {
            for (const chunkItems of chunk(typedEvents.events, 300)) {
                promises.push(queryRunner.manager.insert(typedEvents.eventType, chunkItems as any[]));
            }
        });

        await Promise.all(promises);
        await queryRunner.commitTransaction();

        // TODO: Add Kafka support if we need it again
    } catch (err) {
        if (err instanceof QueryFailedError && err.message === 'could not serialize access due to concurrent update') {
            logger.warn('Simultaneous write attempt, will retry on the next run');
        } else {
            logger.error(`Failed while saving full blocks ${JSON.stringify(blockRanges)}`);
            logger.error(err);
        }
        await queryRunner.rollbackTransaction();
    } finally {
        await queryRunner.release();
    }
}
async function getParseSaveBlocksTransactionsEvents(
    connection: Connection,
    producer: Producer | null,
    newBlocks: EVMBlock[],
) {
    const blockNumbers = newBlocks.map((newBlock) => newBlock.number!);

    const blockRanges = findRanges(blockNumbers);

    logger.info(`Pulling Block Events for blocks: ${JSON.stringify(blockRanges)}`);

    const newBlockReceipts = await web3Source.getBatchBlockReceiptsAsync(blockNumbers);

    const fullBlocks: FullBlock[] = newBlocks.map((newBlock, blockIndex): FullBlock => {
        const transactionsWithLogs = newBlock.transactions.map(
            (tx: EVMTransaction, txIndex: number): FullTransaction => {
                if (newBlock.hash !== newBlockReceipts[blockIndex][txIndex].blockHash) {
                    throw Error('Wrong Block hash');
                }
                return {
                    ...tx,
                    ...newBlockReceipts[blockIndex][txIndex],
                    type: tx.type,
                };
            },
        );
        return { ...newBlocks[blockIndex], transactions: transactionsWithLogs };
    });

    const parsedFullBlocks = fullBlocks.map(parseBlockTransactionsEvents);

    const eventTables = eventScrperProps
        .filter((props) => props.enabled)
        .map((props: EventScraperProps) => props.table);

    await saveFullBlocks(connection, eventTables, parsedFullBlocks);

    if (FEAT_TOKENS_FROM_TRANSFERS) {
        const tokensFromTransfers = [
            ...new Set(
                newBlockReceipts
                    .flat()
                    .map((tx) => tx.logs)
                    .flat()
                    .filter((log) => log.topics.length > 0 && log.topics[0] === TRANSFER_EVENT_TOPIC_0)
                    .map((log) => log.address),
            ),
        ];
        await getParseSaveTokensAsync(connection, producer, web3Source, tokensFromTransfers);
    }
}

export class BlockEventsScraper {
    public async backfillAsync(connection: Connection, producer: Producer | null): Promise<void> {
        const startTime = new Date().getTime();

        const oldestBlocksToBackfill = await connection.query(
            `SELECT DISTINCT block_number
             FROM ${SCHEMA}.tx_backfill
             ORDER BY block_number
             LIMIT ${MAX_BLOCKS_TO_PULL}`,
        );

        if (oldestBlocksToBackfill.length > 0) {
            logger.info(`Backfilling blocks`);

            const blockNumbers = oldestBlocksToBackfill.map(
                (backfillBlock: { block_number: number }) => backfillBlock.block_number,
            );

            const newBlocks = await web3Source.getBatchBlockInfoAsync(blockNumbers, true);
            getParseSaveBlocksTransactionsEvents(connection, producer, newBlocks);

            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.manager.query(
                `DELETE FROM ${SCHEMA}.backfill_blocks
                         WHERE block_number IN (${blockNumbers.join(',')})`,
            );
            queryRunner.release();

            const endTime = new Date().getTime();
            const scriptDurationSeconds = (endTime - startTime) / 1000;
            SCRIPT_RUN_DURATION.set({ script: 'events-by-block-backfill' }, scriptDurationSeconds);
        }
    }
    public async getParseSaveAsync(connection: Connection, producer: Producer | null): Promise<void> {
        const startTime = new Date().getTime();

        // Monitor

        const currentBlockNumber = await web3Source.getBlockNumberAsync();

        CURRENT_BLOCK.labels({ chain: CHAIN_NAME }).set(currentBlockNumber);
        logger.info(`Current block: ${currentBlockNumber}`);

        // Is new?
        const lastKnownBlock = await connection.getRepository(Block).findOne({
            order: { blockNumber: 'DESC' },
        });

        if (lastKnownBlock === undefined) {
            logger.warn('First Run');
            const firstStartBlock = Math.max(...eventScrperProps.map((props) => props.startBlock));
            logger.warn(`Going to start from block: ${firstStartBlock}`);
            const newBlocks = await web3Source.getBatchBlockInfoForRangeAsync(firstStartBlock, firstStartBlock, true);
            getParseSaveBlocksTransactionsEvents(connection, producer, newBlocks);
            return;
        }

        if (lastKnownBlock.blockNumber === currentBlockNumber) {
            logger.debug('No new block, waiting until next interval');
            return;
        }

        const blockRangeStart = lastKnownBlock.blockNumber + 1;
        const blockRangeEnd =
            lastKnownBlock.blockNumber + MAX_BLOCKS_TO_PULL > currentBlockNumber
                ? currentBlockNumber
                : lastKnownBlock.blockNumber + MAX_BLOCKS_TO_PULL;

        const newBlocks = await web3Source.getBatchBlockInfoForRangeAsync(blockRangeStart, blockRangeEnd, true);

        // Reorg handling
        if (newBlocks[0].parentHash !== lastKnownBlock.blockHash) {
            let lookback = BLOCKS_REORG_CHECK_INCREMENT;
            while (lookback < MAX_BLOCKS_REORG) {
                const testBlockNumber = lastKnownBlock.blockNumber - lookback;
                const testBlock = await web3Source.getBlockInfoAsync(testBlockNumber);
                const testBlockDB = await connection.getRepository(Block).findOne({
                    where: { blockNumber: testBlockNumber },
                });

                if (testBlock.hash! === testBlockDB!.blockHash) {
                    logger.warn(`Reorg detected, rewinded ${lookback} blocks`);
                    const queryRunner = connection.createQueryRunner();
                    await queryRunner.connect();
                    await queryRunner.manager.query(
                        `DELETE FROM ${SCHEMA}.blocks
                         WHERE block_number > ${testBlockNumber}`,
                    );
                    queryRunner.release();

                    return;
                }
                lookback += BLOCKS_REORG_CHECK_INCREMENT;
            }
            throw Error(`Big reorg detected, of more than ${lookback}, manual intervention needed`);
        }

        getParseSaveBlocksTransactionsEvents(connection, producer, newBlocks);

        const endTime = new Date().getTime();
        const scriptDurationSeconds = (endTime - startTime) / 1000;
        SCRIPT_RUN_DURATION.set({ script: 'events-by-block' }, scriptDurationSeconds);

        logger.info(`Finished pulling events block by in ${scriptDurationSeconds}`);
    }
}
