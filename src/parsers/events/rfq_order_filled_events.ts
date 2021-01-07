const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { RfqOrderFilledEvent } from '../../entities';
import { NativeFill } from '../../entities';

import { parseEvent } from './parse_event';
import { RFQ_ORDER_FILLED_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseRfqOrderFilledEvent(eventLog: RawLogEntry): RfqOrderFilledEvent{
    const rfqOrderFilledEvent = new RfqOrderFilledEvent();
    parseEvent(eventLog, rfqOrderFilledEvent);
    // decode the basic info directly into rfqOrderFilledEvent

    const decodedLog = abiCoder.decodeLog(RFQ_ORDER_FILLED_ABI.inputs, eventLog.data);

    rfqOrderFilledEvent.orderHash = decodedLog.orderHash    // TODO .toLowerCase();
    rfqOrderFilledEvent.maker = decodedLog.maker.toLowerCase();
    rfqOrderFilledEvent.taker = decodedLog.taker.toLowerCase();

    rfqOrderFilledEvent.makerToken = decodedLog.makerToken.toLowerCase();
    rfqOrderFilledEvent.takerToken = decodedLog.takerToken.toLowerCase();
    rfqOrderFilledEvent.takerTokenFilledAmount = new BigNumber(decodedLog.takerTokenFilledAmount);
    rfqOrderFilledEvent.makerTokenFilledAmount = new BigNumber(decodedLog.makerTokenFilledAmount);

    rfqOrderFilledEvent.pool = decodedLog.pool    // TODO .toLowerCase();

    // TODO
    // rfqOrderFilledEvent.directFlag = true;
    // rfqOrderFilledEvent.directProtocol = 'PLP';

    return rfqOrderFilledEvent;
}


export function parseNativeFillFromRfqOrderFilledEvent(eventLog: RawLogEntry): NativeFill{
    const nativeFill = new NativeFill();
    parseEvent(eventLog, nativeFill);
    // decode the basic info directly into nativeFill

    const decodedLog = abiCoder.decodeLog(RFQ_ORDER_FILLED_ABI.inputs, eventLog.data);

    nativeFill.orderHash = decodedLog.orderHash    // TODO .toLowerCase();
    nativeFill.maker = decodedLog.maker.toLowerCase();
    nativeFill.taker = decodedLog.taker.toLowerCase();
    nativeFill.feeRecipient = null;

    nativeFill.makerToken = decodedLog.makerToken.toLowerCase();
    nativeFill.takerToken = decodedLog.takerToken.toLowerCase();
    nativeFill.takerTokenFilledAmount = new BigNumber(decodedLog.takerTokenFilledAmount);
    nativeFill.makerTokenFilledAmount = new BigNumber(decodedLog.makerTokenFilledAmount);
    nativeFill.takerTokenFeeFilledAmount = null;

    nativeFill.protocolFeePaid = new BigNumber(decodedLog.protocolFeePaid);
    nativeFill.pool = decodedLog.pool    // TODO .toLowerCase();

    nativeFill.nativeOrderFlag = 'RFQ Order'

    return nativeFill;
}
