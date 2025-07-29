import { SETTLER_ERC721_TRANSFER_ABI } from '../../constants';
import { SettlerERC721TransferEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

export function parseSettlerERC721TransferEvent(eventLog: LogEntry): SettlerERC721TransferEvent | null {
    const settlerERC721TransferEvent = new SettlerERC721TransferEvent();

    parseEvent(eventLog, settlerERC721TransferEvent);

    const decodedLog = abiCoder.decodeLog(SETTLER_ERC721_TRANSFER_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    settlerERC721TransferEvent.from = decodedLog.from.toLowerCase();
    settlerERC721TransferEvent.to = decodedLog.to.toLowerCase();
    settlerERC721TransferEvent.token_id = decodedLog.tokenId;

    return settlerERC721TransferEvent;
}
