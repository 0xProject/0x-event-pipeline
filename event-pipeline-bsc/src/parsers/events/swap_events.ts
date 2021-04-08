const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { ERC20BridgeTransferEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { SWAP_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parsePancakeSwapEvent(eventLog: RawLogEntry): ERC20BridgeTransferEvent {
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
        amount0In.gt(amount0Out)
            ? decodedLog.amount0In - decodedLog.amount0Out
            : decodedLog.amount1In - decodedLog.amount1Out,
    ); // taker_token_amount
    eRC20BridgeTransferEvent.toTokenAmount = new BigNumber(
        amount0In.gt(amount0Out)
            ? decodedLog.amount1Out - decodedLog.amount1In
            : decodedLog.amount0Out - decodedLog.amount0In,
    ); // maker_token_amount
    eRC20BridgeTransferEvent.from = ''; // maker
    eRC20BridgeTransferEvent.to = decodedLog.to.toLowerCase(); // taker
    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = '';

    return eRC20BridgeTransferEvent;
}
