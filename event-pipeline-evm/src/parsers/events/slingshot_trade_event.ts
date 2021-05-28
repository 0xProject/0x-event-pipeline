const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { SlingshotTradeEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { SLINGSHOT_TRADE_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseSlingshotTradeEvent(eventLog: RawLogEntry): SlingshotTradeEvent {
    const slingshotTradeEvent = new SlingshotTradeEvent();

    parseEvent(eventLog, slingshotTradeEvent);

    const decodedLog = abiCoder.decodeLog(SLINGSHOT_TRADE_ABI.inputs, eventLog.data, eventLog.topics[1]);

    slingshotTradeEvent.from = decodedLog.user.toLowerCase();
    slingshotTradeEvent.to = decodedLog.recipient.toLowerCase();
    slingshotTradeEvent.fromToken = decodedLog.fromToken.toLowerCase();
    slingshotTradeEvent.toToken = decodedLog.toToken.toLowerCase();
    slingshotTradeEvent.fromTokenAmount = new BigNumber(decodedLog.fromAmount);
    slingshotTradeEvent.toTokenAmount = new BigNumber(decodedLog.toAmount);

    return slingshotTradeEvent;
}
