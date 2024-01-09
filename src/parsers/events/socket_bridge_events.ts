import { assetDataUtils } from '@0x/order-utils';
import { AssetProxyId } from '@0x/types';
import { LogEntry } from 'ethereum-types';

import { SocketBridgeEvent } from '../../entities';
import { convertAssetProxyIdToType } from '../../utils/proxyType';
import { parseEvent } from './parse_event';
import { SOCKET_BRIDGE_ABI } from '../../constants';

import { parse0xAssetTokenAddress, parseV30xBridgeAddress } from '../utils/asset_data_utils';

const abiCoder = require('web3-eth-abi');

export function parseSocketBridgeEvent(eventLog: LogEntry): SocketBridgeEvent {
    const socketBridgeEvent = new SocketBridgeEvent();
    parseEvent(eventLog, socketBridgeEvent);

    const decodedLog = abiCoder.decodeLog(SOCKET_BRIDGE_ABI.inputs, eventLog.data);

    socketBridgeEvent.amount = decodedLog.amount;
    socketBridgeEvent.token = decodedLog.token.toLowerCase();
    socketBridgeEvent.toChainId = decodedLog.toChainId;
    socketBridgeEvent.bridgeName = decodedLog.bridgeName.toLowerCase();
    socketBridgeEvent.sender = decodedLog.sender.toLowerCase();
    socketBridgeEvent.receiver = decodedLog.receiver.toLowerCase();
    socketBridgeEvent.metadata = decodedLog.metadata;

    return socketBridgeEvent;
}
