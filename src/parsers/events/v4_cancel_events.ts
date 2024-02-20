import { V4_CANCEL_ABI } from '../../constants';
import { V4CancelEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

export function parseV4CancelEvent(eventLog: LogEntry): V4CancelEvent {
    const v4CancelEvent = new V4CancelEvent();
    parseEvent(eventLog, v4CancelEvent);

    const decodedLog = abiCoder.decodeLog(V4_CANCEL_ABI.inputs, eventLog.data);

    v4CancelEvent.orderHash = decodedLog.orderHash.toLowerCase();
    v4CancelEvent.maker = decodedLog.maker.toLowerCase();

    return v4CancelEvent;
}
