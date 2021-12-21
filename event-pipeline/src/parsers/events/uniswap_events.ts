import { ERC20BridgeTransferEvent } from '../../entities';
import { Swap } from '../../data_sources/events/uniswap_events';

import { BigNumber } from '@0x/utils';

export function parseUniswapSushiswapEvents(swap: Swap, protocol: string): ERC20BridgeTransferEvent {
    const eRC20BridgeTransferEvent = new ERC20BridgeTransferEvent();

    // set the 'from' field as an existing bridge address, sushi or Uniswap
    const from =
        protocol === 'Sushiswap'
            ? '0x47ed0262a0b688dcb836d254c6a2e96b6c48a9f5'
            : '0xdcd6011f4c6b80e470d9487f5871a0cba7c93f48';

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
    const amount0In = new BigNumber(swap.amount0In).times(
        new BigNumber(10).pow(new BigNumber(swap.pair.token0.decimals)),
    );
    const amount1In = new BigNumber(swap.amount1In).times(
        new BigNumber(10).pow(new BigNumber(swap.pair.token1.decimals)),
    );
    const amount0Out = new BigNumber(swap.amount0Out).times(
        new BigNumber(10).pow(new BigNumber(swap.pair.token0.decimals)),
    );
    const amount1Out = new BigNumber(swap.amount1Out).times(
        new BigNumber(10).pow(new BigNumber(swap.pair.token1.decimals)),
    );

    // There are many possible cases and all kinds of pathological behavior
    // happening with different frequency.
    // We start with checking whether there is a token with zero Out amount.
    // If yes, then this is the fromToken aka taker token. If no (both have
    // non-zero Out amounts), we look for one with more Out than In which will
    // be the toToken. 
    // This might also not be the case (found all-time 6 uni swaps like this),
    // then we choose token0 = taker, toker1 = maker, amounts=0.  
    const bigZero = new BigNumber(0);
    let fromToken = swap.pair.token0;
    let toToken = swap.pair.token1;
    let fromTokenAmount = bigZero;
    let toTokenAmount = bigZero;

    if (amount0Out.isEqualTo(bigZero) || amount1Out.isEqualTo(bigZero)) {
        fromToken = amount0Out.isEqualTo(bigZero) ? swap.pair.token0 : swap.pair.token1;
        toToken = amount0Out.isEqualTo(bigZero) ? swap.pair.token1 : swap.pair.token0;
        fromTokenAmount = amount0Out.isEqualTo(bigZero) ? amount0In : amount1In;
        toTokenAmount = amount0Out.isEqualTo(bigZero) ? amount1Out : amount0Out;
    } 
    if (amount0Out.gt(amount0In) || amount1Out.gt(amount1In)) { 
        fromToken = amount0Out.gt(amount0In) ? swap.pair.token1 : swap.pair.token0;
        toToken = amount0Out.gt(amount0In) ? swap.pair.token0 : swap.pair.token1;
        amount0Out.gt(amount0In) ? amount1In.minus(amount1Out) : amount0In.minus(amount0Out);
        toTokenAmount = amount0Out.gt(amount0In) ? amount0Out : amount1Out;
    };

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
