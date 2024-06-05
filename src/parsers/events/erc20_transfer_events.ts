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

    if (eventLog.topics.length === 3 && eventLog.data !== '0x') {
        // Standard ERC20 Transfer - 3 topics (2 indexed), 32 bytes of data (3 inputs)
        const decodedLog = abiCoder.decodeLog(
            STANDARD_ERC20_TRANSFER_ABI.inputs,
            eventLog.data,
            eventLog.topics.slice(1),
        );

        eRC20TransferEvent.from = decodedLog.from.toLowerCase();
        eRC20TransferEvent.to = decodedLog.to.toLowerCase();
        eRC20TransferEvent.value = new BigNumber(decodedLog.value);
    } else if (eventLog.topics.length <= 3) {
        // Non-Standard ERC20 Transfer - Any number of topics or data (3 inputs)
        var baseInputs = STANDARD_ERC20_TRANSFER_ABI.inputs.map((object) => ({ ...object }));
        baseInputs.forEach((inp, index) => {
            baseInputs[index].indexed = false;
            return baseInputs;
        });

        var wasDecoded = false;
        var rowInputs = baseInputs.map((object) => ({ ...object }));
        // First "succesful" decoding is considered correct
        // The `from` and `to` might be wrong.
        // Left-most inputs are assumed more likely to be indexed.
        for (var i = -1; i < baseInputs.length - 1; i++) {
            if (i >= 0) rowInputs[i].indexed = true;
            for (var j = i; j < baseInputs.length; j++) {
                const currInputs = rowInputs.map((object) => ({ ...object }));

                if (j >= 0) currInputs[j].indexed = true;
                try {
                    const decodedLog = abiCoder.decodeLog(currInputs, eventLog.data, eventLog.topics.slice(1));
                    // Assume addresses won't have first 7 characters be 0's.
                    if (
                        decodedLog.from.substring(0, 9) !== '0x0000000' &&
                        decodedLog.to.substring(0, 9) !== '0x0000000'
                    ) {
                        wasDecoded = true;
                        eRC20TransferEvent.from = decodedLog.from.toLowerCase();
                        eRC20TransferEvent.to = decodedLog.to.toLowerCase();
                        eRC20TransferEvent.value = new BigNumber(decodedLog.value);
                    }
                    break;
                } catch (e: unknown) {}
            }
            if (wasDecoded) break;
        }
    } else {
        return null;
    }

    return eRC20TransferEvent;
}
