import { STANDARD_ERC20_TRANSFER_ABI } from '../../constants';
import { ERC20TransferEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { BigNumber } from '@0x/utils';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

const Web3Utils = require('web3-utils');

export function parseERC20TransferEvent(eventLog: LogEntry): ERC20TransferEvent | null {
    const eRC20TransferEvent = new ERC20TransferEvent();

    parseEvent(eventLog, eRC20TransferEvent);

    if (eventLog.topics.length === 4 && eventLog.data === '0x') {
        // ERC721 Transfer - 4 topics, no data
        return null;
    } else if (eventLog.topics.length === 3 && eventLog.data !== '0x') {
        // Standard ERC20 Transfer - 3 topics, 32 bytes of data
        const decodedLog = abiCoder.decodeLog(
            STANDARD_ERC20_TRANSFER_ABI.inputs,
            eventLog.data,
            eventLog.topics.slice(1),
        );

        eRC20TransferEvent.from = decodedLog.from.toLowerCase();
        eRC20TransferEvent.to = decodedLog.to.toLowerCase();
        eRC20TransferEvent.value = new BigNumber(decodedLog.value);
    } else {
        return null;
    }

    return eRC20TransferEvent;
}
