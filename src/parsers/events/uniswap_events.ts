import { ERC20BridgeTransferEvent } from '../../entities';
import { Swap } from '../../data_sources/events/uniswap_events';

import { BigNumber } from '@0x/utils';

export function parseUniswapSushiswapEvents(swap: Swap, protocol: string): ERC20BridgeTransferEvent {
    const eRC20BridgeTransferEvent = new ERC20BridgeTransferEvent();
    
    // set the 'from' field as an existing bridge address, sushi or Uniswap
    const from = protocol === 'Sushiswap' ? '0x47ed0262a0b688dcb836d254c6a2e96b6c48a9f5' : '0xdcd6011f4c6b80e470d9487f5871a0cba7c93f48';

    eRC20BridgeTransferEvent.observedTimestamp = new Date().getTime();
    eRC20BridgeTransferEvent.contractAddress = swap.pair.id;
    eRC20BridgeTransferEvent.transactionHash = swap.transaction.id;
    // non nullable field, but this info isn't present
    // set to dummy value for now
    eRC20BridgeTransferEvent.transactionIndex = 0;
    eRC20BridgeTransferEvent.logIndex = Number(swap.logIndex);
    // non nullable field, but this info isn't present
    // set to dummy value for now
    eRC20BridgeTransferEvent.blockHash = '0x';
    eRC20BridgeTransferEvent.blockNumber = Number(swap.transaction.blockNumber);

    // scale the values to the raw amounts
    const amount0In = new BigNumber(swap.amount0In).times(new BigNumber(10).pow(new BigNumber(swap.pair.token0.decimals)));
    const amount1In = new BigNumber(swap.amount1In).times(new BigNumber(10).pow(new BigNumber(swap.pair.token1.decimals)));
    const amount0Out = new BigNumber(swap.amount0Out).times(new BigNumber(10).pow(new BigNumber(swap.pair.token0.decimals)));
    const amount1Out = new BigNumber(swap.amount1Out).times(new BigNumber(10).pow(new BigNumber(swap.pair.token1.decimals)));

    const fromToken = amount0In.gt(amount1In) ? swap.pair.token0 : swap.pair.token1;
    const toToken = amount0Out.gt(amount1Out) ? swap.pair.token0 : swap.pair.token1;

    const fromTokenAmount = amount0In.gt(amount1In) ? amount0In : amount1In;
    const toTokenAmount = amount0Out.gt(amount1Out) ? amount0Out : amount1Out;

    eRC20BridgeTransferEvent.fromToken = fromToken.id;
    eRC20BridgeTransferEvent.toToken = toToken.id;
    eRC20BridgeTransferEvent.fromTokenAmount = fromTokenAmount;
    eRC20BridgeTransferEvent.toTokenAmount = toTokenAmount;
    eRC20BridgeTransferEvent.from = from;
    eRC20BridgeTransferEvent.to = swap.to;

    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = protocol;

    return eRC20BridgeTransferEvent;
}
