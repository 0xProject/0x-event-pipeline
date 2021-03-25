const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { ExpiredRfqOrderEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { EXPIRED_RFQ_ORDER_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseExpiredRfqOrderEvent(eventLog: RawLogEntry): ExpiredRfqOrderEvent{
    const expiredRfqOrderEvent = new ExpiredRfqOrderEvent();
    parseEvent(eventLog, expiredRfqOrderEvent);

    const decodedLog = abiCoder.decodeLog(EXPIRED_RFQ_ORDER_ABI.inputs, eventLog.data);

    expiredRfqOrderEvent.orderHash = decodedLog.orderHash.toLowerCase();
    expiredRfqOrderEvent.maker = decodedLog.maker.toLowerCase();
    expiredRfqOrderEvent.expiry = new BigNumber(decodedLog.expiry);

    return expiredRfqOrderEvent;
}
