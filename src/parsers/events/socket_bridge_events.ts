import { SOCKET_BRIDGE_ABI } from '../../constants';
import { SocketBridgeEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { LogEntry } from 'ethereum-types';

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
