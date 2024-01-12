import { TokenTransferEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { LogEntry } from 'ethereum-types';

export function parseTokenTransfer(eventLog: LogEntry): TokenTransferEvent {
    const tokenTransferEvent = new TokenTransferEvent();

    parseEvent(eventLog, tokenTransferEvent);

    return tokenTransferEvent;
}
