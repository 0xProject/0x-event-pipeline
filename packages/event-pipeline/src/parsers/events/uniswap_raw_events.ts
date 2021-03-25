const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { UniswapSwapEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { UNISWAP_SWAP_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseUniswapRawSwapEvent(eventLog: RawLogEntry): UniswapSwapEvent {
    const uniswapSwapEvent = new UniswapSwapEvent();

    parseEvent(eventLog, uniswapSwapEvent);

    const decodedLog = abiCoder.decodeLog(UNISWAP_SWAP_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    uniswapSwapEvent.amount0In = new BigNumber(decodedLog.amount0In);
    uniswapSwapEvent.amount1In = new BigNumber(decodedLog.amount1In);
    uniswapSwapEvent.amount0Out = new BigNumber(decodedLog.amount0Out);
    uniswapSwapEvent.amount1Out = new BigNumber(decodedLog.amount1Out);
    uniswapSwapEvent.from = decodedLog.sender.toLowerCase();
    uniswapSwapEvent.to = decodedLog.to.toLowerCase();

    return uniswapSwapEvent;
}


