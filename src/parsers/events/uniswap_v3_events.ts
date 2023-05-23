const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { ERC20BridgeTransferEvent, UniswapV3SwapEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { UNISWAP_V3_SWAP_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseUniswapV3VIPSwapEvent(eventLog: RawLogEntry): ERC20BridgeTransferEvent {
    const eRC20BridgeTransferEvent = new ERC20BridgeTransferEvent();
    parseEvent(eventLog, eRC20BridgeTransferEvent);
    // decode the basic info directly into eRC20BridgeTransferEvent
    const decodedLog = abiCoder.decodeLog(UNISWAP_V3_SWAP_ABI.inputs, eventLog.data, [
        eventLog.topics[1],
        eventLog.topics[2],
    ]);
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

export function parseUniswapV3SwapEvent(eventLog: RawLogEntry): UniswapV3SwapEvent {
    const uniswapV3SwapEvent = new UniswapV3SwapEvent();
    parseEvent(eventLog, uniswapV3SwapEvent);
    const decodedLog = abiCoder.decodeLog(UNISWAP_V3_SWAP_ABI.inputs, eventLog.data, [
        eventLog.topics[1],
        eventLog.topics[2],
    ]);
    const amount0 = new BigNumber(decodedLog.amount0).abs();
    const amount1 = new BigNumber(decodedLog.amount1).abs();

    uniswapV3SwapEvent.sender = decodedLog.sender
    uniswapV3SwapEvent.recipient = decodedLog.recipient
    uniswapV3SwapEvent.amount0 = amount0 
    uniswapV3SwapEvent.amount1 = amount1;
    uniswapV3SwapEvent.sqrtPriceX96 = decodedLog.sqrtPriceX96;
    uniswapV3SwapEvent.liquidity = decodedLog.liquidity;
    uniswapV3SwapEvent.tick = decodedLog.tick;

    return uniswapV3SwapEvent;

}
