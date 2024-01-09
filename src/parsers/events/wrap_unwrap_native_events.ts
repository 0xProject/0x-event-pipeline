const abiCoder = require('web3-eth-abi');
import { LogEntry } from 'ethereum-types';

import { BigNumber } from '@0x/utils';

import { WrapNativeEvent, UnwrapNativeEvent, Event } from '../../entities';
import { parseEvent } from './parse_event';
import { WRAP_NATIVE_ABI, UNWRAP_NATIVE_ABI, TRANSFER_ABI } from '../../constants';

export function parseWrapNativeEvent(eventLog: LogEntry): WrapNativeEvent {
    const wrapNativeEvent = new WrapNativeEvent();

    parseEvent(eventLog, wrapNativeEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(WRAP_NATIVE_ABI.inputs, eventLog.data, [eventLog.topics[1]]);

    wrapNativeEvent.dst = decodedLog.dst.toLowerCase();
    wrapNativeEvent.wad = new BigNumber(decodedLog.wad);

    return wrapNativeEvent;
}

export function parseUnwrapNativeEvent(eventLog: LogEntry): UnwrapNativeEvent {
    const unwrapNativeEvent = new UnwrapNativeEvent();
    parseEvent(eventLog, unwrapNativeEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(UNWRAP_NATIVE_ABI.inputs, eventLog.data, [eventLog.topics[1]]);

    unwrapNativeEvent.src = decodedLog.src.toLowerCase();
    unwrapNativeEvent.wad = new BigNumber(decodedLog.wad);

    return unwrapNativeEvent;
}

export function parseWrapNativeTransferEvent(eventLog: LogEntry): WrapNativeEvent {
    const wrapNativeEvent = new WrapNativeEvent();

    parseEvent(eventLog, wrapNativeEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(TRANSFER_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    wrapNativeEvent.dst = decodedLog.to.toLowerCase();
    wrapNativeEvent.wad = new BigNumber(decodedLog.value);

    return wrapNativeEvent;
}

export function parseUnwrapNativeTransferEvent(eventLog: LogEntry): UnwrapNativeEvent {
    const unwrapNativeEvent = new UnwrapNativeEvent();
    parseEvent(eventLog, unwrapNativeEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(TRANSFER_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    unwrapNativeEvent.src = decodedLog.from.toLowerCase();
    unwrapNativeEvent.wad = new BigNumber(decodedLog.value);

    return unwrapNativeEvent;
}
