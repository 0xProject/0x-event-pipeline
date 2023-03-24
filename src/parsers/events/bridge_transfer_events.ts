const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { ERC20BridgeTransferEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { BRIDGE_FILL_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

const Web3Utils = require('web3-utils');

export function parseBridgeFill(eventLog: RawLogEntry): ERC20BridgeTransferEvent {
    const eRC20BridgeTransferEvent = new ERC20BridgeTransferEvent();

    parseEvent(eventLog, eRC20BridgeTransferEvent);

    const decodedLog = abiCoder.decodeLog(BRIDGE_FILL_ABI.inputs, eventLog.data);

    eRC20BridgeTransferEvent.fromToken = decodedLog.inputToken.toLowerCase();
    eRC20BridgeTransferEvent.toToken = decodedLog.outputToken.toLowerCase();
    eRC20BridgeTransferEvent.fromTokenAmount = new BigNumber(decodedLog.inputTokenAmount);
    eRC20BridgeTransferEvent.toTokenAmount = new BigNumber(decodedLog.outputTokenAmount);
    eRC20BridgeTransferEvent.from = Web3Utils.hexToUtf8('0x' + decodedLog.source.slice(34)); // 34 = len(0x) + 32
    eRC20BridgeTransferEvent.to = null;
    eRC20BridgeTransferEvent.directFlag = false;
    eRC20BridgeTransferEvent.directProtocol = null;

    return eRC20BridgeTransferEvent;
}
