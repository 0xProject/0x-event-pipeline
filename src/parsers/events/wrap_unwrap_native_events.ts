const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { WrapNativeEvent, UnwrapNativeEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { WRAP_NATIVE_ABI, UNWRAP_NATIVE_ABI, TRANSFER_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseWrapNativeEvent(eventLog: RawLogEntry): WrapNativeEvent {
    const wrapNativeEvent = new WrapNativeEvent();

    parseEvent(eventLog, wrapNativeEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(WRAP_NATIVE_ABI.inputs, eventLog.data, [eventLog.topics[1]]);

    wrapNativeEvent.dst = decodedLog.dst.toLowerCase();
    wrapNativeEvent.wad = new BigNumber(decodedLog.wad);

    return wrapNativeEvent;
}

export function parseUnwrapNativeEvent(eventLog: RawLogEntry): UnwrapNativeEvent {
    const unwrapNativeEvent = new UnwrapNativeEvent();
    parseEvent(eventLog, unwrapNativeEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(UNWRAP_NATIVE_ABI.inputs, eventLog.data, [eventLog.topics[1]]);

    unwrapNativeEvent.src = decodedLog.src.toLowerCase();
    unwrapNativeEvent.wad = new BigNumber(decodedLog.wad);

    return unwrapNativeEvent;
}

export function parseWrapNativeTransferEvent(eventLog: RawLogEntry): WrapNativeEvent {
    const wrapNativeEvent = new WrapNativeEvent();

    parseEvent(eventLog, wrapNativeEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(TRANSFER_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    wrapNativeEvent.dst = decodedLog.to.toLowerCase();
    wrapNativeEvent.wad = new BigNumber(decodedLog.value);

    return wrapNativeEvent;
}

export function parseUnwrapNativeTransferEvent(eventLog: RawLogEntry): UnwrapNativeEvent {
    const unwrapNativeEvent = new UnwrapNativeEvent();
    parseEvent(eventLog, unwrapNativeEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(TRANSFER_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    unwrapNativeEvent.src = decodedLog.from.toLowerCase();
    unwrapNativeEvent.wad = new BigNumber(decodedLog.value);

    return unwrapNativeEvent;
}
