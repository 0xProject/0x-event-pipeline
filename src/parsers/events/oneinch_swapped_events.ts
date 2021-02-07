const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import {OneInchSwappedEvent} from '../../entities';

import { parseEvent } from './parse_event';
import {ONEINCH_SWAPPED_ABI} from '../../constants';
import { BigNumber } from '@0x/utils';

// Function that parses 1inch's Swapped event from an event log
export function parse1InchSwappedEvent(eventLog: RawLogEntry): OneInchSwappedEvent{

    const oneInchSwappedEvent = new OneInchSwappedEvent();

    parseEvent(eventLog, oneInchSwappedEvent);

    // decode the basic info directly into oneInchSwappedEvent
    // As it's non-anonymous event as defined in the ABI, topic[0] should not be provided for the decoding
    const decodedLog = abiCoder.decodeLog(ONEINCH_SWAPPED_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    oneInchSwappedEvent.sender = decodedLog.sender.toLowerCase();
    oneInchSwappedEvent.srcToken = decodedLog.srcToken.toLowerCase();
    oneInchSwappedEvent.dstToken = decodedLog.dstToken.toLowerCase();
    oneInchSwappedEvent.dstReceiver = decodedLog.dstReceiver.toLowerCase();
    oneInchSwappedEvent.amount = new BigNumber(decodedLog.amount);
    oneInchSwappedEvent.spentAmount = new BigNumber(decodedLog.spentAmount);
    oneInchSwappedEvent.returnAmount = new BigNumber(decodedLog.returnAmount);
    oneInchSwappedEvent.minReturnAmount = new BigNumber(decodedLog.minReturnAmount);
    oneInchSwappedEvent.guaranteedAmount = new BigNumber(decodedLog.guaranteedAmount);
    oneInchSwappedEvent.referrer = decodedLog.referrer.toLowerCase();

    return oneInchSwappedEvent;
}