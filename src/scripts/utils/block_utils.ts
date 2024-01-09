import { Producer } from 'kafkajs';
import { Connection, QueryFailedError } from 'typeorm';
import { hexToUtf8 } from 'web3-utils';
import { BlockWithoutTransactionData, LogEntry } from 'ethereum-types';

import { ContractCallInfo, LogPullInfo, Web3Source } from '../../data_sources/events/web3';
import { Event, Transaction } from '../../entities';
import { chunk, DeleteOptions, kafkaSendAsync, kafkaSendCommandAsync, logger } from '../../utils';
import { TokenMetadataMap, extractTokensFromLogs, getParseSaveTokensAsync, getParseTxsAsync } from './web3_utils';

import { CHAIN_NAME_LOWER, MAX_BLOCKS_REORG, MAX_BLOCKS_TO_SEARCH, RESCRAPE_BLOCKS, SCHEMA } from '../../config';
import { LastBlockProcessed } from '../../entities';
import { SCAN_END_BLOCK, RPC_LOGS_ERROR, SCAN_RESULTS, SCAN_START_BLOCK, SKIPPED_EVENTS } from '../../utils/metrics';

export interface BackfillEventsResponse {
    transactionHashes: string[];
    startBlockNumber: number | null;
    endBlockNumber: number | null;
}

export type Topic = string | null;

export function contractTopicFilter(contractAddress: string | null, topics: Topic[], log: LogEntry): boolean {
    if (contractAddress !== null && contractAddress.toLowerCase() !== log.address.toLowerCase()) {
        return false;
    }
    for (let topicIndex = 0; topicIndex <= 4; topicIndex++) {
        if (
            topics[topicIndex] !== null &&
            topics[topicIndex] !== undefined &&
            (log.topics[topicIndex] === undefined || topics[topicIndex] !== log.topics[topicIndex])
        ) {
            return false;
        }
    }
    return true;
}
