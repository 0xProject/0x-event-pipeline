const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { ParaswapSwappedV4Event, ParaswapSwappedV5Event } from '../../entities';
import { parseEvent } from './parse_event';
import { PARASWAP_SWAPPED_V4_ABI, PARASWAP_SWAPPED_V5_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseParaswapSwappedV4Event(eventLog: RawLogEntry): ParaswapSwappedV4Event {
    const paraswapSwappedEvent = new ParaswapSwappedV4Event();

    parseEvent(eventLog, paraswapSwappedEvent);

    const decodedLog = abiCoder.decodeLog(PARASWAP_SWAPPED_V4_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    paraswapSwappedEvent.from = decodedLog.initiator.toLowerCase();
    paraswapSwappedEvent.to = decodedLog.beneficiary.toLowerCase();
    paraswapSwappedEvent.fromToken = decodedLog.srcToken.toLowerCase();
    paraswapSwappedEvent.toToken = decodedLog.destToken.toLowerCase();
    paraswapSwappedEvent.fromTokenAmount = new BigNumber(decodedLog.srcAmount);
    paraswapSwappedEvent.toTokenAmount = new BigNumber(decodedLog.receivedAmount);
    paraswapSwappedEvent.expectedAmount = new BigNumber(decodedLog.expectedAmount);
    paraswapSwappedEvent.referrer = decodedLog.referrer.toLowerCase();

    return paraswapSwappedEvent;
}

export function parseParaswapSwappedV5Event(eventLog: RawLogEntry): ParaswapSwappedV5Event {
    const paraswapSwappedEvent = new ParaswapSwappedV5Event();

    parseEvent(eventLog, paraswapSwappedEvent);

    const decodedLog = abiCoder.decodeLog(PARASWAP_SWAPPED_V5_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    paraswapSwappedEvent.from = decodedLog.initiator.toLowerCase();
    paraswapSwappedEvent.to = decodedLog.beneficiary.toLowerCase();
    paraswapSwappedEvent.fromToken = decodedLog.srcToken.toLowerCase();
    paraswapSwappedEvent.toToken = decodedLog.destToken.toLowerCase();
    paraswapSwappedEvent.fromTokenAmount = new BigNumber(decodedLog.srcAmount);
    paraswapSwappedEvent.toTokenAmount = new BigNumber(decodedLog.receivedAmount);
    paraswapSwappedEvent.expectedAmount = new BigNumber(decodedLog.expectedAmount);
    paraswapSwappedEvent.uuid = decodedLog.uuid.toLowerCase();

    return paraswapSwappedEvent;
}
