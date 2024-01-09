const abiCoder = require('web3-eth-abi');
import { LogEntry } from 'ethereum-types';
import { logger } from '../../utils/logger';
import { ERC20BridgeTransferEvent, UniswapV2PairCreatedEvent, UniswapV2SyncEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { UNISWAP_V2_SWAP_ABI, UNISWAP_V2_SYNC_ABI, UNISWAP_V2_PAIR_CREATED_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';
import { UniV2PoolSingleton } from '../../uniV2PoolSingleton';

export function parseUniswapV2SwapEvent(eventLog: LogEntry): ERC20BridgeTransferEvent | null {
    const eRC20BridgeTransferEvent = new ERC20BridgeTransferEvent();
    parseEvent(eventLog, eRC20BridgeTransferEvent);
    // decode the basic info directly into eRC20BridgeTransferEvent
    const decodedLog = abiCoder.decodeLog(UNISWAP_V2_SWAP_ABI.inputs, eventLog.data, [
        eventLog.topics[1],
        eventLog.topics[2],
    ]);

    const uniV2PoolSingleton = UniV2PoolSingleton.getInstance();

    const poolInfo = uniV2PoolSingleton.getPool(eRC20BridgeTransferEvent.contractAddress);

    if (poolInfo === undefined) {
        logger.error(
            `Got a Uni v2 VIP trade from an unknown pool, ignoring. Tx: ${eRC20BridgeTransferEvent.transactionHash}, Pool: ${eRC20BridgeTransferEvent.contractAddress}`,
        );
        return null;
    }
    const { token0, token1, protocol } = poolInfo;

    const protocolName = protocol.split('!')[0];

    const amount0In = new BigNumber(decodedLog.amount0In);
    const amount1In = new BigNumber(decodedLog.amount1In);
    const amount0Out = new BigNumber(decodedLog.amount0Out);
    const amount1Out = new BigNumber(decodedLog.amount1Out);

    eRC20BridgeTransferEvent.fromToken = amount0In.gt(amount0Out) ? token0 : token1; // taker_token
    eRC20BridgeTransferEvent.toToken = amount0In.gt(amount0Out) ? token1 : token0; // maker_token

    eRC20BridgeTransferEvent.fromTokenAmount = new BigNumber(
        amount0In.gt(amount0Out) ? amount0In.minus(amount0Out) : amount1In.minus(amount1Out),
    ); // taker_token_amount
    eRC20BridgeTransferEvent.toTokenAmount = new BigNumber(
        amount0In.gt(amount0Out) ? amount1Out.minus(amount1In) : amount0Out.minus(amount0In),
    ); // maker_token_amount
    eRC20BridgeTransferEvent.from = protocolName; // maker TODO(jorge): Replace with pool address, after checking downstream impact
    eRC20BridgeTransferEvent.to = decodedLog.to.toLowerCase(); // taker
    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = protocolName;

    return eRC20BridgeTransferEvent;
}

export function parseUniswapV2PairCreatedEvent(eventLog: LogEntry, protocol: string): UniswapV2PairCreatedEvent {
    const pairCreated = new UniswapV2PairCreatedEvent();
    parseEvent(eventLog, pairCreated);
    const decodedLog = abiCoder.decodeLog(UNISWAP_V2_PAIR_CREATED_ABI.inputs, eventLog.data, [
        eventLog.topics[1],
        eventLog.topics[2],
    ]);

    pairCreated.token0 = decodedLog.token0.toLowerCase();
    pairCreated.token1 = decodedLog.token1.toLowerCase();
    pairCreated.pair = decodedLog.pair.toLowerCase();
    pairCreated.pairFactoryCounter = new BigNumber(decodedLog.pairFactoryCounter);
    pairCreated.protocol = protocol;

    return pairCreated;
}

export function parseUniswapV2SyncEvent(eventLog: LogEntry): UniswapV2SyncEvent {
    const sync = new UniswapV2SyncEvent();
    parseEvent(eventLog, sync);
    const decodedLog = abiCoder.decodeLog(UNISWAP_V2_SYNC_ABI.inputs, eventLog.data, []);

    sync.reserve0 = new BigNumber(decodedLog.reserve0);
    sync.reserve1 = new BigNumber(decodedLog.reserve1);

    return sync;
}
