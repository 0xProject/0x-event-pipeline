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

    const bigZero = new BigNumber(0);
    const amount0In = new BigNumber(decodedLog.amount0In);
    const amount1In = new BigNumber(decodedLog.amount1In);
    const amount0Out = new BigNumber(decodedLog.amount0Out);
    const amount1Out = new BigNumber(decodedLog.amount1Out);

    if (amount0Out.isEqualTo(bigZero) || amount1Out.isEqualTo(bigZero)) {
        eRC20BridgeTransferEvent.fromToken = amount0Out.isEqualTo(bigZero) ? '0' : '1';
        eRC20BridgeTransferEvent.toToken = amount0Out.isEqualTo(bigZero) ? '1' : '0';
        eRC20BridgeTransferEvent.fromTokenAmount = amount0Out.isEqualTo(bigZero) ? amount0In : amount1In;
        eRC20BridgeTransferEvent.toTokenAmount = amount0Out.isEqualTo(bigZero) ? amount1Out : amount0Out;
    } else if (amount0Out.gt(amount0In) || amount1Out.gt(amount1In)) {
        eRC20BridgeTransferEvent.fromToken = amount0Out.gt(amount0In) ? '1' : '0';
        eRC20BridgeTransferEvent.toToken = amount0Out.gt(amount0In) ? '0' : '1';
        eRC20BridgeTransferEvent.fromTokenAmount = amount0Out.gt(amount0In)
            ? amount1In.minus(amount1Out)
            : amount0In.minus(amount0Out);
        eRC20BridgeTransferEvent.toTokenAmount = amount0Out.gt(amount0In) ? amount0Out : amount1Out;
    } else {
        eRC20BridgeTransferEvent.fromToken = '0';
        eRC20BridgeTransferEvent.toToken = '1';
        eRC20BridgeTransferEvent.fromTokenAmount = bigZero;
        eRC20BridgeTransferEvent.toTokenAmount = bigZero;
    }

    eRC20BridgeTransferEvent.from = ''; // maker
    eRC20BridgeTransferEvent.to = decodedLog.to.toLowerCase(); // taker
    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = '';

    return eRC20BridgeTransferEvent;
}
