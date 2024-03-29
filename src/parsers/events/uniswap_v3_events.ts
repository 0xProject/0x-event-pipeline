import { UNISWAP_V3_SWAP_ABI, UNISWAP_V3_POOL_CREATED_ABI } from '../../constants';
import { ERC20BridgeTransferEvent, UniswapV3SwapEvent, UniswapV3PoolCreatedEvent } from '../../entities';
import { UniV3PoolSingleton } from '../../uniV3PoolSingleton';
import { logger } from '../../utils/logger';
import { parseEvent } from './parse_event';
import { BigNumber } from '@0x/utils';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

export function parseUniswapV3VIPSwapEvent(eventLog: LogEntry): ERC20BridgeTransferEvent | null {
    const eRC20BridgeTransferEvent = new ERC20BridgeTransferEvent();
    parseEvent(eventLog, eRC20BridgeTransferEvent);
    // decode the basic info directly into eRC20BridgeTransferEvent
    const decodedLog = abiCoder.decodeLog(UNISWAP_V3_SWAP_ABI.inputs, eventLog.data, [
        eventLog.topics[1],
        eventLog.topics[2],
    ]);
    const amount0 = new BigNumber(decodedLog.amount0).abs();
    const amount1 = new BigNumber(decodedLog.amount1).abs();

    const uniV3PoolSingleton = UniV3PoolSingleton.getInstance();

    const poolInfo = uniV3PoolSingleton.getPool(eRC20BridgeTransferEvent.contractAddress);

    if (poolInfo === undefined) {
        logger.error(
            `Got a Uni v3 VIP trade from an unknown pool, ignoring. Tx: ${eRC20BridgeTransferEvent.transactionHash}, Pool: ${eRC20BridgeTransferEvent.contractAddress}`,
        );
        return null;
    }
    const { token0, token1 } = poolInfo;

    // amount0 and amount1 are of opposite signs
    // neg value means token left the pool ie. maker
    // pos value means token entered the pool ie. taker
    eRC20BridgeTransferEvent.fromToken = decodedLog.amount0 >= 0 ? token0 : token1; // taker_token
    eRC20BridgeTransferEvent.toToken = decodedLog.amount0 < 0 ? token0 : token1; // maker_token
    eRC20BridgeTransferEvent.fromTokenAmount = decodedLog.amount0 >= 0 ? amount0 : amount1; // taker_token_amount
    eRC20BridgeTransferEvent.toTokenAmount = decodedLog.amount0 < 0 ? amount0 : amount1; // maker_token_amount
    eRC20BridgeTransferEvent.from = 'UniswapV3'; // maker
    eRC20BridgeTransferEvent.to = decodedLog.recipient.toLowerCase(); // taker
    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = 'UniswapV3';

    return eRC20BridgeTransferEvent;
}

export function parseUniswapV3SwapEvent(eventLog: LogEntry): UniswapV3SwapEvent {
    const uniswapV3SwapEvent = new UniswapV3SwapEvent();
    parseEvent(eventLog, uniswapV3SwapEvent);
    const decodedLog = abiCoder.decodeLog(UNISWAP_V3_SWAP_ABI.inputs, eventLog.data, [
        eventLog.topics[1],
        eventLog.topics[2],
    ]);
    const amount0 = new BigNumber(decodedLog.amount0);
    const amount1 = new BigNumber(decodedLog.amount1);

    uniswapV3SwapEvent.sender = decodedLog.sender.toLowerCase();
    uniswapV3SwapEvent.recipient = decodedLog.recipient.toLowerCase();
    uniswapV3SwapEvent.amount0 = amount0;
    uniswapV3SwapEvent.amount1 = amount1;
    uniswapV3SwapEvent.sqrtpricex96 = decodedLog.sqrtPriceX96;
    uniswapV3SwapEvent.liquidity = decodedLog.liquidity;
    uniswapV3SwapEvent.tick = decodedLog.tick;

    return uniswapV3SwapEvent;
}

export function parseUniswapV3PoolCreatedEvent(eventLog: LogEntry): UniswapV3PoolCreatedEvent {
    const UniswapV3poolCreated = new UniswapV3PoolCreatedEvent();
    parseEvent(eventLog, UniswapV3poolCreated);
    const decodedLog = abiCoder.decodeLog(UNISWAP_V3_POOL_CREATED_ABI.inputs, eventLog.data, [
        eventLog.topics[1],
        eventLog.topics[2],
        eventLog.topics[3],
    ]);

    UniswapV3poolCreated.token0 = decodedLog.token0.toLowerCase();
    UniswapV3poolCreated.token1 = decodedLog.token1.toLowerCase();
    UniswapV3poolCreated.fee = decodedLog.fee;
    UniswapV3poolCreated.tickSpacing = decodedLog.tickSpacing;
    UniswapV3poolCreated.pool = decodedLog.pool.toLowerCase();

    return UniswapV3poolCreated;
}
