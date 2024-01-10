import { LogEntry } from 'ethereum-types';

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
