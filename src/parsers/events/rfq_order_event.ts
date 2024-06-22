import { RFQOrderEvent } from '../../entities';
import { SettlerContractSingleton } from '../../settlerContractSingleton';
import { parseEvent } from './parse_event';
import { BigNumber } from '@0x/utils';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

const Web3Utils = require('web3-utils');

export function parseRFQOrderEvent(eventLog: LogEntry): RFQOrderEvent | null {
    const rfqOrderEvent = new RFQOrderEvent();

    if (eventLog.topics.length > 0) {
        return null;
    }

    const orderHashSize = 32 * 2;
    const filledAmountSize = 16 * 2;
    const totalSize = '0x'.length + orderHashSize + filledAmountSize;
    if (eventLog.data.length !== totalSize) {
        return null;
    }

    parseEvent(eventLog, rfqOrderEvent);

    const settlerContractSingleton = SettlerContractSingleton.getInstance();
    const settlerContracts = settlerContractSingleton.getContracts();
    if (!settlerContracts.find((contract) => contract.address === rfqOrderEvent.contractAddress)) {
        return null;
    }

    rfqOrderEvent.orderHash = '0x' + eventLog.data.substring('0x'.length, '0x'.length + orderHashSize);
    rfqOrderEvent.filledAmount = new BigNumber('0x' + eventLog.data.substring('0x'.length + orderHashSize));
    return rfqOrderEvent;
}
