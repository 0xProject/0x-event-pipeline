import { META_TRANSACTION_EXECUTED_ABI } from '../../constants';
import { MetaTransactionExecutedEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

export function parseMetaTransactionExecutedEvent(eventLog: LogEntry): MetaTransactionExecutedEvent {
    const metaTransactionExecutedEvent = new MetaTransactionExecutedEvent();

    parseEvent(eventLog, metaTransactionExecutedEvent);

    const decodedLog = abiCoder.decodeLog(META_TRANSACTION_EXECUTED_ABI.inputs, eventLog.data, eventLog.topics[1]);

    metaTransactionExecutedEvent.hash = decodedLog.hash;
    metaTransactionExecutedEvent.selector = decodedLog.selector;
    metaTransactionExecutedEvent.signer = decodedLog.signer.toLowerCase();
    metaTransactionExecutedEvent.sender = decodedLog.sender.toLowerCase();

    return metaTransactionExecutedEvent;
}
