const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { TimechainSwapV1Event } from '../../entities';
import { parseEvent } from './parse_event';
import { TIMECHAIN_SWAP_V1_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseTimechainSwapV1Event(eventLog: RawLogEntry): TimechainSwapV1Event {
    const timechainSwapEvent = new TimechainSwapV1Event();

    parseEvent(eventLog, timechainSwapEvent);

    const decodedLog = abiCoder.decodeLog(TIMECHAIN_SWAP_V1_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    timechainSwapEvent.trader = decodedLog.trader.toLowerCase();
    timechainSwapEvent.fromToken = decodedLog.srcToken.toLowerCase();
    timechainSwapEvent.toToken = decodedLog.dstToken.toLowerCase();
    timechainSwapEvent.fromTokenAmount = new BigNumber(decodedLog.srcAmount);
    timechainSwapEvent.toTokenAmount = new BigNumber(decodedLog.dstAmount);

    return timechainSwapEvent;
}
