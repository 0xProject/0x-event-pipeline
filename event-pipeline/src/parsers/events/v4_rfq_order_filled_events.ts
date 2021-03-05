const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { V4RfqOrderFilledEvent } from '../../entities';
import { NativeFill } from '../../entities';

import { parseEvent } from './parse_event';
import { RFQ_ORDER_FILLED_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseV4RfqOrderFilledEvent(eventLog: RawLogEntry): V4RfqOrderFilledEvent{
    const rfqOrderFilledEvent = new V4RfqOrderFilledEvent();
    parseEvent(eventLog, rfqOrderFilledEvent);
    // decode the basic info directly into rfqOrderFilledEvent

    const decodedLog = abiCoder.decodeLog(RFQ_ORDER_FILLED_ABI.inputs, eventLog.data);

    rfqOrderFilledEvent.orderHash = decodedLog.orderHash.toLowerCase();
    rfqOrderFilledEvent.maker = decodedLog.maker.toLowerCase();
    rfqOrderFilledEvent.taker = decodedLog.taker.toLowerCase();

    rfqOrderFilledEvent.makerToken = decodedLog.makerToken.toLowerCase();
    rfqOrderFilledEvent.takerToken = decodedLog.takerToken.toLowerCase();
    rfqOrderFilledEvent.takerTokenFilledAmount = new BigNumber(decodedLog.takerTokenFilledAmount);
    rfqOrderFilledEvent.makerTokenFilledAmount = new BigNumber(decodedLog.makerTokenFilledAmount);

    rfqOrderFilledEvent.pool = String(Number(decodedLog.pool));

    // TODO
    // rfqOrderFilledEvent.directFlag = true;
    // rfqOrderFilledEvent.directProtocol = 'PLP';

    return rfqOrderFilledEvent;
}


export function parseNativeFillFromV4RfqOrderFilledEvent(eventLog: RawLogEntry): NativeFill{
    const nativeFill = new NativeFill();
    parseEvent(eventLog, nativeFill);
    // decode the basic info directly into nativeFill

    const decodedLog = abiCoder.decodeLog(RFQ_ORDER_FILLED_ABI.inputs, eventLog.data);

    nativeFill.orderHash = decodedLog.orderHash.toLowerCase();
    nativeFill.maker = decodedLog.maker.toLowerCase();
    nativeFill.taker = decodedLog.taker.toLowerCase();
    nativeFill.feeRecipient = null;

    nativeFill.makerToken = decodedLog.makerToken.toLowerCase();
    nativeFill.takerToken = decodedLog.takerToken.toLowerCase();
    nativeFill.takerTokenFilledAmount = new BigNumber(decodedLog.takerTokenFilledAmount);
    nativeFill.makerTokenFilledAmount = new BigNumber(decodedLog.makerTokenFilledAmount);
    nativeFill.takerFeePaid = null;
    nativeFill.makerFeePaid = null;
    nativeFill.takerProxyType = null;
    nativeFill.makerProxyType = null;
    nativeFill.takerFeeToken = null;
    nativeFill.makerFeeToken = null;
    nativeFill.protocolFeePaid = null;
    nativeFill.pool = String(Number(decodedLog.pool));

    nativeFill.nativeOrderType = 'RFQ Order';
    nativeFill.protocolVersion = 'v4';

    return nativeFill;
}
