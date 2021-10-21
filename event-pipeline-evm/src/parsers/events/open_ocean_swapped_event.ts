const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { OpenOceanSwappedV1Event } from '../../entities';
import { parseEvent } from './parse_event';
import { OPEN_OCEAN_SWAPPED_V1_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseOpenOceanSwappedV1Event(eventLog: RawLogEntry): OpenOceanSwappedV1Event {
    const openOceanSwappedEvent = new OpenOceanSwappedV1Event();

    parseEvent(eventLog, openOceanSwappedEvent);

    const decodedLog = abiCoder.decodeLog(OPEN_OCEAN_SWAPPED_V1_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    openOceanSwappedEvent.from = decodedLog.sender.toLowerCase();
    openOceanSwappedEvent.to = decodedLog.dstReceiver.toLowerCase();
    openOceanSwappedEvent.fromToken = decodedLog.srcToken.toLowerCase();
    openOceanSwappedEvent.toToken = decodedLog.dstToken.toLowerCase();
    openOceanSwappedEvent.fromTokenAmount = new BigNumber(decodedLog.spentAmount);
    openOceanSwappedEvent.toTokenAmount = new BigNumber(decodedLog.returnAmount);
    openOceanSwappedEvent.expectedAmount = new BigNumber(decodedLog.guaranteedAmount);
    openOceanSwappedEvent.referrer = decodedLog.referrer.toLowerCase();
    openOceanSwappedEvent.expectedFromTokenAmount = new BigNumber(decodedLog.amount);
    openOceanSwappedEvent.minToTokenAmount = new BigNumber(decodedLog.minReturnAmount);

    return openOceanSwappedEvent;
}
