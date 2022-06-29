const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { LogTransferEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { LOG_TRANSFER_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseLogTransferEvent(eventLog: RawLogEntry): LogTransferEvent {
    const logTransferEvent = new LogTransferEvent();
    parseEvent(eventLog, logTransferEvent);
    // decode the basic info directly into logTransferEvent
    const decodedLog = abiCoder.decodeLog(LOG_TRANSFER_ABI.inputs, eventLog.data, [
        eventLog.topics[1],
        eventLog.topics[2],
        eventLog.topics[3],
    ]);

    logTransferEvent.token = decodedLog.token;
    logTransferEvent.from = decodedLog.from;
    logTransferEvent.to = decodedLog.to;
    logTransferEvent.amount = new BigNumber(decodedLog.amount);
    logTransferEvent.input1 = new BigNumber(decodedLog.input1);
    logTransferEvent.input2 = new BigNumber(decodedLog.input2);
    logTransferEvent.output1 = new BigNumber(decodedLog.output1);
    logTransferEvent.output2 = new BigNumber(decodedLog.output2);

    return logTransferEvent;
}
