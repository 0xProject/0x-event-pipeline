import { TRANSFORMED_ERC20_ABI } from '../../constants';
import { TransformedERC20Event } from '../../entities';
import { parseEvent } from './parse_event';
import { BigNumber } from '@0x/utils';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

export function parseTransformedERC20Event(eventLog: LogEntry): TransformedERC20Event {
    const transformedERC20Event = new TransformedERC20Event();

    parseEvent(eventLog, transformedERC20Event);

    const decodedLog = abiCoder.decodeLog(TRANSFORMED_ERC20_ABI.inputs, eventLog.data, eventLog.topics[1]);

    transformedERC20Event.taker = decodedLog.taker.toLowerCase();
    transformedERC20Event.inputToken = decodedLog.inputToken.toLowerCase();
    transformedERC20Event.outputToken = decodedLog.outputToken.toLowerCase();
    transformedERC20Event.inputTokenAmount = new BigNumber(decodedLog.inputTokenAmount);
    transformedERC20Event.outputTokenAmount = new BigNumber(decodedLog.outputTokenAmount);

    return transformedERC20Event;
}
