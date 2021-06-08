const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { ERC20BridgeTransferEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { SWAP_V3_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseUniswapV3SwapEvent(eventLog: RawLogEntry): ERC20BridgeTransferEvent {
    const eRC20BridgeTransferEvent = new ERC20BridgeTransferEvent();
    parseEvent(eventLog, eRC20BridgeTransferEvent);
    // decode the basic info directly into eRC20BridgeTransferEvent
    const decodedLog = abiCoder.decodeLog(SWAP_V3_ABI.inputs, eventLog.data, [eventLog.topics[1], eventLog.topics[2]]);

    eRC20BridgeTransferEvent.fromToken = '1'; // taker_token
    eRC20BridgeTransferEvent.toToken = '0'; // maker_token

    eRC20BridgeTransferEvent.fromTokenAmount = new BigNumber(Math.abs(decodedLog.amount1)); // taker_token_amount
    eRC20BridgeTransferEvent.toTokenAmount = new BigNumber(Math.abs(decodedLog.amount0)); // maker_token_amount
    eRC20BridgeTransferEvent.from = 'UniswapV3'; // maker
    eRC20BridgeTransferEvent.to = decodedLog.recipient.toLowerCase(); // taker
    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = 'UniswapV3';

    return eRC20BridgeTransferEvent;
}
