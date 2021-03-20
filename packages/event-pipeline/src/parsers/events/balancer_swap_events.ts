const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { BalancerSwapEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { BALANCER_SWAP_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseBalancerSwapEvent(eventLog: RawLogEntry): BalancerSwapEvent{
    const balancerSwapEvent = new BalancerSwapEvent();
    parseEvent(eventLog, balancerSwapEvent);
    // decode the basic info directly into balancerSwapEvent

    const decodedLog = abiCoder.decodeLog(BALANCER_SWAP_ABI.inputs, eventLog.data);

    balancerSwapEvent.caller = decodedLog.caller.toLowerCase();
    balancerSwapEvent.tokenIn = decodedLog.tokenIn.toLowerCase();
    balancerSwapEvent.tokenOut = decodedLog.tokenOut.toLowerCase();
    balancerSwapEvent.tokenAmountIn = new BigNumber(decodedLog.tokenAmountIn);
    balancerSwapEvent.tokenAmountOut = new BigNumber(decodedLog.tokenAmountOut);

    return balancerSwapEvent;
}
