const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import { LimitOrderFilledEvent } from '../../entities';
import { NativeFill } from '../../entities';

import { parseEvent } from './parse_event';
import { LIMIT_ORDER_FILLED_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseLimitOrderFilledEvent(eventLog: RawLogEntry): LimitOrderFilledEvent{
    const limitOrderFilledEvent = new LimitOrderFilledEvent();
    parseEvent(eventLog, limitOrderFilledEvent);
    // decode the basic info directly into limitOrderFilledEvent

    const decodedLog = abiCoder.decodeLog(LIMIT_ORDER_FILLED_ABI.inputs, eventLog.data);

    limitOrderFilledEvent.orderHash = decodedLog.orderHash    // TODO .toLowerCase();
    limitOrderFilledEvent.maker = decodedLog.maker.toLowerCase();
    limitOrderFilledEvent.taker = decodedLog.taker.toLowerCase();
    limitOrderFilledEvent.feeRecipient = decodedLog.feeRecipient.toLowerCase();

    limitOrderFilledEvent.makerToken = decodedLog.makerToken.toLowerCase();
    limitOrderFilledEvent.takerToken = decodedLog.takerToken.toLowerCase();
    limitOrderFilledEvent.takerTokenFilledAmount = new BigNumber(decodedLog.takerTokenFilledAmount);
    limitOrderFilledEvent.makerTokenFilledAmount = new BigNumber(decodedLog.makerTokenFilledAmount);
    limitOrderFilledEvent.takerTokenFeeFilledAmount = new BigNumber(decodedLog.takerTokenFeeFilledAmount);

    limitOrderFilledEvent.protocolFeePaid = new BigNumber(decodedLog.protocolFeePaid);
    limitOrderFilledEvent.pool = decodedLog.pool;    // TODO .toLowerCase();

    // TODO
    // limitOrderFilledEvent.directFlag = true;
    // limitOrderFilledEvent.directProtocol = 'PLP';

    return limitOrderFilledEvent;
}

export function parseNativeFillFromLimitOrderFilledEvent(eventLog: RawLogEntry): NativeFill{
    const nativeFill = new NativeFill();
    parseEvent(eventLog, nativeFill);
    // decode the basic info directly into nativeFill

    const decodedLog = abiCoder.decodeLog(LIMIT_ORDER_FILLED_ABI.inputs, eventLog.data);

    nativeFill.orderHash = decodedLog.orderHash    // TODO .toLowerCase();
    nativeFill.maker = decodedLog.maker.toLowerCase();
    nativeFill.taker = decodedLog.taker.toLowerCase();
    nativeFill.feeRecipient = decodedLog.feeRecipient.toLowerCase();

    nativeFill.makerToken = decodedLog.makerToken.toLowerCase();
    nativeFill.takerToken = decodedLog.takerToken.toLowerCase();
    nativeFill.takerTokenFilledAmount = new BigNumber(decodedLog.takerTokenFilledAmount);
    nativeFill.makerTokenFilledAmount = new BigNumber(decodedLog.makerTokenFilledAmount);
    nativeFill.takerFeePaid = new BigNumber(decodedLog.takerTokenFeeFilledAmount);
    nativeFill.makerFeePaid = null;
    nativeFill.takerProxyType = null;
    nativeFill.makerProxyType = null;
    nativeFill.takerFeeToken = decodedLog.takerToken.toLowerCase();
    nativeFill.makerFeeToken = null;

    nativeFill.protocolFeePaid = new BigNumber(decodedLog.protocolFeePaid);
    nativeFill.pool = decodedLog.pool;

    nativeFill.nativeOrderFlag = 'Limit Order';
    nativeFill.protocolVersion = 'v4';

    return nativeFill;
}
