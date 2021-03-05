import { LogWithDecodedArgs } from 'ethereum-types';
import { ExchangeTransactionExecutionEventArgs } from '@0x/contract-wrappers';

import { TransactionExecutionEvent } from '../../entities';
import { parseEvent } from './parse_event';

/**
 * Parses raw event logs for a transaction execution events and returns an array of
 * TransactionExecutionEvent entities.
 * @param eventLogs Raw event logs (e.g. returned from contract-wrappers).
 */
export function parseTransactionExecutionEvents(eventLogs: LogWithDecodedArgs<ExchangeTransactionExecutionEventArgs>[]): TransactionExecutionEvent[] {
    return eventLogs.map(event => parseTransactionExecutionEvent(event))
}

/**
 * Converts a raw event log for a fill event into an ExchangeFillEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseTransactionExecutionEvent(eventLog: LogWithDecodedArgs<ExchangeTransactionExecutionEventArgs>): TransactionExecutionEvent {

    const transactionExecutionEvent = new TransactionExecutionEvent();
    parseEvent(eventLog, transactionExecutionEvent);

    transactionExecutionEvent.zeroexTransactionHash = eventLog.args.transactionHash;

    return transactionExecutionEvent;
}
