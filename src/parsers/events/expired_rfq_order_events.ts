import { EXPIRED_RFQ_ORDER_ABI } from '../../constants';
import { ExpiredRfqOrderEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { BigNumber } from '@0x/utils';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

export function parseExpiredRfqOrderEvent(eventLog: LogEntry): ExpiredRfqOrderEvent {
    const expiredRfqOrderEvent = new ExpiredRfqOrderEvent();
    parseEvent(eventLog, expiredRfqOrderEvent);

    const decodedLog = abiCoder.decodeLog(EXPIRED_RFQ_ORDER_ABI.inputs, eventLog.data);

    expiredRfqOrderEvent.orderHash = decodedLog.orderHash.toLowerCase();
    expiredRfqOrderEvent.maker = decodedLog.maker.toLowerCase();
    expiredRfqOrderEvent.expiry = new BigNumber(decodedLog.expiry);

    return expiredRfqOrderEvent;
}
