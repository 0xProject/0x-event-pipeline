import { V3_TRANSACTION_EXECUTION_ABI } from '../../constants';
import { TransactionExecutionEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { ExchangeTransactionExecutionEventArgs } from '@0x/contract-wrappers';
import { LogEntry } from 'ethereum-types';
import { LogWithDecodedArgs } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');
/**
 * Parses raw event logs for a transaction execution events and returns an array of
 * TransactionExecutionEvent entities.
 * @param eventLogs Raw event logs (e.g. returned from contract-wrappers).
 */
export function parseTransactionExecutionEvents(
    eventLogs: LogWithDecodedArgs<ExchangeTransactionExecutionEventArgs>[],
): TransactionExecutionEvent[] {
    return eventLogs.map((event) => parseTransactionExecutionEvent(event));
}

/**
 * Converts a raw event log for a fill event into an ExchangeFillEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseTransactionExecutionEvent(eventLog: LogEntry): TransactionExecutionEvent {
    const transactionExecutionEvent = new TransactionExecutionEvent();
    parseEvent(eventLog, transactionExecutionEvent);

    const decodedLog = abiCoder.decodeLog(
        V3_TRANSACTION_EXECUTION_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    transactionExecutionEvent.zeroexTransactionHash = decodedLog.transactionHash;

    return transactionExecutionEvent;
}
