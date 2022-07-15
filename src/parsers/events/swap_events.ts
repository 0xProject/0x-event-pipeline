const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { ERC20BridgeTransferEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { SWAP_ABI, SWAP_V3_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseUniswapV2SwapEvent(eventLog: RawLogEntry): ERC20BridgeTransferEvent {
    const eRC20BridgeTransferEvent = new ERC20BridgeTransferEvent();
    parseEvent(eventLog, eRC20BridgeTransferEvent);
    // decode the basic info directly into eRC20BridgeTransferEvent
    const decodedLog = abiCoder.decodeLog(SWAP_ABI.inputs, eventLog.data, [eventLog.topics[1], eventLog.topics[2]]);

    const amount0In = new BigNumber(decodedLog.amount0In);
    const amount1In = new BigNumber(decodedLog.amount1In);
    const amount0Out = new BigNumber(decodedLog.amount0Out);
    const amount1Out = new BigNumber(decodedLog.amount1Out);

    eRC20BridgeTransferEvent.fromToken = amount0In.gt(amount0Out) ? '0' : '1'; // taker_token
    eRC20BridgeTransferEvent.toToken = amount0In.gt(amount0Out) ? '1' : '0'; // maker_token

    eRC20BridgeTransferEvent.fromTokenAmount = new BigNumber(
        amount0In.gt(amount0Out) ? amount0In.minus(amount0Out) : amount1In.minus(amount1Out),
    ); // taker_token_amount
    eRC20BridgeTransferEvent.toTokenAmount = new BigNumber(
        amount0In.gt(amount0Out) ? amount1Out.minus(amount1In) : amount0Out.minus(amount0In),
    ); // maker_token_amount
    eRC20BridgeTransferEvent.from = ''; // maker
    eRC20BridgeTransferEvent.to = decodedLog.to.toLowerCase(); // taker
    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = '';

    return eRC20BridgeTransferEvent;
}

export function parseUniswapV3SwapEvent(eventLog: RawLogEntry): ERC20BridgeTransferEvent {
    const eRC20BridgeTransferEvent = new ERC20BridgeTransferEvent();
    parseEvent(eventLog, eRC20BridgeTransferEvent);
    // decode the basic info directly into eRC20BridgeTransferEvent
    const decodedLog = abiCoder.decodeLog(SWAP_V3_ABI.inputs, eventLog.data, [eventLog.topics[1], eventLog.topics[2]]);
    const amount0 = new BigNumber(decodedLog.amount0).abs();
    const amount1 = new BigNumber(decodedLog.amount1).abs();

    // amount0 and amount1 are of opposite signs
    // neg value means token left the pool ie. maker
    // pos value means token entered the pool ie. taker
    eRC20BridgeTransferEvent.fromToken = decodedLog.amount0 >= 0 ? '0' : '1'; // taker_token
    eRC20BridgeTransferEvent.toToken = decodedLog.amount0 < 0 ? '0' : '1'; // maker_token
    eRC20BridgeTransferEvent.fromTokenAmount = decodedLog.amount0 >= 0 ? amount0 : amount1; // taker_token_amount
    eRC20BridgeTransferEvent.toTokenAmount = decodedLog.amount0 < 0 ? amount0 : amount1; // maker_token_amount
    eRC20BridgeTransferEvent.from = 'UniswapV3'; // maker
    eRC20BridgeTransferEvent.to = decodedLog.recipient.toLowerCase(); // taker
    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = 'UniswapV3';

    return eRC20BridgeTransferEvent;
}
