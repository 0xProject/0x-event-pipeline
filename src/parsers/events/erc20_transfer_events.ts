import { ERC20_TRANSFER_ABI } from '../../constants';
import { ERC20TransferEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { BigNumber } from '@0x/utils';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

const Web3Utils = require('web3-utils');

export function parseERC20TransferEvent(eventLog: LogEntry): ERC20TransferEvent | null {
    const eRC20TransferEvent = new ERC20TransferEvent();

    parseEvent(eventLog, eRC20TransferEvent);

    // ERC20 Transfers have 3 topics and 32 bytes of data
    // ERC721 Transfers have 4 topics and no data
    if (eventLog.topics.length !== 3) {
        return null;
    }

    const decodedLog = abiCoder.decodeLog(ERC20_TRANSFER_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    eRC20TransferEvent.from = decodedLog.from.toLowerCase();
    eRC20TransferEvent.to = decodedLog.to.toLowerCase();
    eRC20TransferEvent.value = new BigNumber(decodedLog.value);

    return eRC20TransferEvent;
}
