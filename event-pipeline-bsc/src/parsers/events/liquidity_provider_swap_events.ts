const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { ERC20BridgeTransferEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { LIQUIDITY_PROVIDER_SWAP_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseLiquidityProviderSwapEvent(eventLog: RawLogEntry): ERC20BridgeTransferEvent{
    const eRC20BridgeTransferEvent = new ERC20BridgeTransferEvent();
    parseEvent(eventLog, eRC20BridgeTransferEvent);
    // decode the basic info directly into eRC20BridgeTransferEvent

    const decodedLog = abiCoder.decodeLog(LIQUIDITY_PROVIDER_SWAP_ABI.inputs, eventLog.data);

    eRC20BridgeTransferEvent.fromToken = decodedLog.inputToken.toLowerCase();
    eRC20BridgeTransferEvent.toToken = decodedLog.outputToken.toLowerCase();
    eRC20BridgeTransferEvent.fromTokenAmount = new BigNumber(decodedLog.inputTokenAmount);
    eRC20BridgeTransferEvent.toTokenAmount = new BigNumber(decodedLog.outputTokenAmount);
    eRC20BridgeTransferEvent.from = decodedLog.provider.toLowerCase();
    eRC20BridgeTransferEvent.to = decodedLog.recipient.toLowerCase();
    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = 'PLP';

    return eRC20BridgeTransferEvent;
}
