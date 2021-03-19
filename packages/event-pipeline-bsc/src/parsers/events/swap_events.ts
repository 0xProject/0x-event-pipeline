const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { ERC20BridgeTransferEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { SWAP_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parsePancakeSwapEvent(eventLog: RawLogEntry): ERC20BridgeTransferEvent{
    const eRC20BridgeTransferEvent = new ERC20BridgeTransferEvent();
    parseEvent(eventLog, eRC20BridgeTransferEvent);
    // decode the basic info directly into eRC20BridgeTransferEvent

    const decodedLog = abiCoder.decodeLog(SWAP_ABI.inputs, eventLog.data);

    eRC20BridgeTransferEvent.fromToken = new BigNumber(decodedLog.amount0In)> new BigNumber(decodedLog.amount1In)? '0':'1'; // taker_token ??
    eRC20BridgeTransferEvent.toToken = new BigNumber(decodedLog.amount0In)> new BigNumber(decodedLog.amount1In)? '1':'0'; // maker_token ??

    const amount0In = new BigNumber(decodedLog.amount0In);
    const amount1In = new BigNumber(decodedLog.amount1In);
    const amount0Out = new BigNumber(decodedLog.amount0Out);
    const amount1Out = new BigNumber(decodedLog.amount1Out);


    eRC20BridgeTransferEvent.fromTokenAmount = amount0In.gt(amount1In) ? amount0In: amount1In; // taker_token_amount 
    eRC20BridgeTransferEvent.toTokenAmount = amount0In.gt(amount1In) ? amount1Out: amount0Out; // maker_token_amount 
    
 

    eRC20BridgeTransferEvent.from = 'PancakeSwap Bridge'; // maker 
    eRC20BridgeTransferEvent.to = decodedLog.to.toLowerCase(); // taker
    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = 'PancakeSwap';

    return eRC20BridgeTransferEvent;
}
