const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { ParaswapSwappedEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { PARASWAP_SWAPPED_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseParaswapSwappedEvent(eventLog: RawLogEntry): ParaswapSwappedEvent {
    const paraswapSwappedEvent = new ParaswapSwappedEvent();

    parseEvent(eventLog, paraswapSwappedEvent);

    const decodedLog = abiCoder.decodeLog(PARASWAP_SWAPPED_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

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
