import { LogEntry } from 'ethereum-types';
import { Event } from '../../entities';

export function parseEvent(eventLog: LogEntry, eventEntity: Event) {
    eventEntity.observedTimestamp = new Date().getTime();
    eventEntity.contractAddress = eventLog.address as string;
    eventEntity.transactionHash = eventLog.transactionHash;
    eventEntity.transactionIndex = eventLog.transactionIndex as number;
    eventEntity.logIndex = eventLog.logIndex as number;
    eventEntity.blockHash = eventLog.blockHash as string;
    eventEntity.blockNumber = eventLog.blockNumber as number;
}
