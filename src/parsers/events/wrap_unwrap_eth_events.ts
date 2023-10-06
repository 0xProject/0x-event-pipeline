const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { WrapETHEvent, UnwrapETHEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { WRAP_ETH_ABI, UNWRAP_ETH_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseWrapETHEvent(eventLog: RawLogEntry): WrapETHEvent {
    const wrapETHEvent = new WrapETHEvent();
    parseEvent(eventLog, wrapETHEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(WRAP_ETH_ABI.inputs, eventLog.data);

    wrapETHEvent.sender_address = decodedLog.dst.toLowerCase();
    wrapETHEvent.amount = new BigNumber(decodedLog.wad);

    return wrapETHEvent;
}

export function parseUnwrapETHEvent(eventLog: RawLogEntry): UnwrapETHEvent {
    const unwrapETHEvent = new UnwrapETHEvent();
    parseEvent(eventLog, unwrapETHEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(UNWRAP_ETH_ABI.inputs, eventLog.data);

    unwrapETHEvent.receiver_address = decodedLog.src.toLowerCase();
    unwrapETHEvent.amount = new BigNumber(decodedLog.wad);

    return unwrapETHEvent;
}
