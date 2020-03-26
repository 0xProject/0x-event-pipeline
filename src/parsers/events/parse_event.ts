import { LogEntry, RawLogEntry } from 'ethereum-types';
import { Event } from '../../entities';

export function parseEvent(eventLog: LogEntry | RawLogEntry, eventEntity: Event) {
    eventEntity.observedTimestamp = new Date().getTime();
    eventEntity.contractAddress = (eventLog.address as string).toLowerCase();
    eventEntity.transactionHash = eventLog.transactionHash.toLowerCase();
    eventEntity.transactionIndex = eventLog.transactionIndex as number;
    eventEntity.logIndex = eventLog.logIndex as number;
    eventEntity.blockHash = (eventLog.blockHash as string).toLowerCase();
    eventEntity.blockNumber = eventLog.blockNumber as number;
}
