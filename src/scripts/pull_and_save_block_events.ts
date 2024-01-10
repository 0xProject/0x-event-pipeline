import { Producer } from 'kafkajs';
import { web3Factory } from '@0x/dev-utils';
import { chunk, logger } from '../utils';
import { Connection, QueryFailedError, InsertResult } from 'typeorm';
import { Web3Source, BlockWithTransactionData1559 as EVMBlock } from '../data_sources/events/web3';
import { Block, Transaction, TransactionReceipt } from '../entities';

import { parseBlock, parseTransaction, parseTransactionReceipt } from '../parsers/web3/parse_web3_objects';

import { LogEntry, TransactionReceiptStatus } from 'ethereum-types';

import { Transaction1559 as EVMTransaction } from '../data_sources/events/web3';
import { contractTopicFilter } from './utils/block_utils';

import { SCHEMA, CHAIN_NAME, EVM_RPC_URL, MAX_BLOCKS_TO_PULL } from '../config';
import { eventScrperProps, EventScraperProps } from '../events';

import { CURRENT_BLOCK, SCRIPT_RUN_DURATION } from '../utils/metrics';

interface FullTransaction extends EVMTransaction {
    blockHash: string;
    blockNumber: number;
    gasUsed: number;
    transactionIndex: number;
    to: string;
    effectiveGasPrice: number;
    logs: LogEntry[];
    status: TransactionReceiptStatus;
    cumulativeGasUsed: number;
    contractAddress: string;
    transactionHash: string;
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

                if (props.callback) {
                    filteredLogs.map((log) => [log]).map(props.callback); // TODO: do not convert to array
                }
                return {
                    eventType: props.tType,
                    eventName: props.name,
                    events: filteredLogs,
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

    //console.log(parsedBlocks);
    //console.log(parsedTransactions);
    //console.log(parsedTransactionReceipts);
    //console.log(parsedEventsByType);

    const blockRangeStart = parsedBlocks[0].blockNumber;
    const blockRangeEnd = parsedBlocks[parsedBlocks.length - 1].blockNumber;

    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    try {
        await queryRunner.startTransaction('REPEATABLE READ');

        // Delete
        const tablesToDelete = ['blocks', 'transactions', 'transaction_receipts'].concat(eventTables);

        const deletePromises: Promise<InsertResult>[] = [];
        tablesToDelete.forEach(async (tableName) => {
            deletePromises.push(
                queryRunner.manager.query(
                    `DELETE FROM ${SCHEMA}.${tableName}
                     WHERE
                       block_number >= ${blockRangeStart} AND
                       block_number <= ${blockRangeEnd}`,
                ),
            );
        });

        Promise.all(deletePromises);

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

        Promise.all(promises);
        await queryRunner.commitTransaction();

        // TODO: Add Kafka support if we need it again
    } catch (err) {
        if (err instanceof QueryFailedError && err.message === 'could not serialize access due to concurrent update') {
            logger.warn('Simultaneous write attempt, will retry on the next run');
        } else {
            logger.error(`Failed while saving full blocks ${blockRangeStart} - ${blockRangeEnd}`);
            logger.error(err);
        }
        // since we have errors lets rollback changes we made
        await queryRunner.rollbackTransaction();
    } finally {
        // you need to release query runner which is manually created:
        //await queryRunner.release();
    }
}

export class BlockEventsScraper {
    public async getParseSaveAsync(connection: Connection, _producer: Producer | null): Promise<void> {
        // Monitor

        const currentBlockNumber = await web3Source.getBlockNumberAsync();

        CURRENT_BLOCK.labels({ chain: CHAIN_NAME }).set(currentBlockNumber);
        logger.info(`Current block: ${currentBlockNumber}`);

        // Is new?
        const lastKnownBlock = await connection.getRepository(Block).findOne({
            order: { blockNumber: 'DESC' },
        });

        if (lastKnownBlock === undefined) {
            // TODO: coldStart
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

        // Was there a reorg?
        const newBlocks = await web3Source.getBatchBlockInfoForRangeAsync(blockRangeStart, blockRangeEnd, true);

        if (newBlocks[0].parentHash !== lastKnownBlock.blockHash) {
            // TODO: reorg
            logger.error('Possible Reorg');
            return;
        }

        const startTime = new Date().getTime();
        logger.info(`Pulling Block Events for blocks: ${blockRangeStart} - ${blockRangeEnd}`);

        const newBlockReceipts = await web3Source.getBatchBlockReceiptsForRangeAsync(blockRangeStart, blockRangeEnd);

        const fullBlocks: FullBlock[] = newBlocks.map((newBlock, blockIndex) => {
            const transactionsWithLogs = newBlock.transactions.map((tx: EVMTransaction, txIndex: number) => {
                if (newBlock.hash !== newBlockReceipts[blockIndex][txIndex].blockHash) {
                    throw Error('Wrong Block hash');
                }
                return {
                    ...tx,
                    gasUsed: newBlockReceipts[blockIndex][txIndex].gasUsed,
                    logs: newBlockReceipts[blockIndex][txIndex].logs,
                    transactionHash: tx.hash,
                    cumulativeGasUsed: newBlockReceipts[blockIndex][txIndex].cumulativeGasUsed,
                    contractAddress: newBlockReceipts[blockIndex][txIndex].contractAddress,
                };
            });
            return { ...newBlock, transactions: transactionsWithLogs };
        });

        const parsedFullBlocks = fullBlocks.map(parseBlockTransactionsEvents);

        const eventTables = eventScrperProps.map((props: EventScraperProps) => props.table);

        await saveFullBlocks(connection, eventTables, parsedFullBlocks);

        const endTime = new Date().getTime();
        const scriptDurationSeconds = (endTime - startTime) / 1000;
        SCRIPT_RUN_DURATION.set({ script: 'events-by-topic' }, scriptDurationSeconds);

        logger.info(`Finished pulling events block by in ${scriptDurationSeconds}`);

        //throw Error('Pause');
    }

    private getLastKnownBlock = async (connection: Connection): Promise<Block> => {
        const queryResult = await connection.getRepository(Block).findOne({
            order: {
                blockNumber: 'DESC',
            },
        });

        if (queryResult === undefined) {
            //TODO: ?
        }
        return queryResult!;
    };
}
