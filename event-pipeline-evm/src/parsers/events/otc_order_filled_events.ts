import { assetDataUtils } from '@0x/order-utils';
import { AssetProxyId } from '@0x/types';
import { RawLogEntry } from 'ethereum-types';
import { BigNumber } from '@0x/utils';

import { OtcOrderFilledEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { OTC_ORDER_FILLED_ABI } from '../../constants';
import { NativeFill } from '../../entities';

const abiCoder = require('web3-eth-abi');

/**
 * Parses raw event logs for a OTC Fill Event and returns an array of
 * OtcOrderFilledEvent entities.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */

export function parseOtcOrderFilledEvent(eventLog: RawLogEntry): OtcOrderFilledEvent {
    const otcOrderFillEvent = new OtcOrderFilledEvent();
    parseEvent(eventLog, otcOrderFillEvent);

    const decodedLog = abiCoder.decodeLog(
        OTC_ORDER_FILLED_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    otcOrderFillEvent.orderHash = decodedLog.orderHash.toLowerCase();
    otcOrderFillEvent.makerAddress = decodedLog.maker.toLowerCase();
    otcOrderFillEvent.takerAddress = decodedLog.taker.toLowerCase();
    otcOrderFillEvent.makerTokenAddress = decodedLog.makerToken.toLowerCase();
    otcOrderFillEvent.takerTokenAddress = decodedLog.takerToken.toLowerCase();
    otcOrderFillEvent.makerTokenFilledAmount = decodedLog.makerTokenFilledAmount;
    otcOrderFillEvent.takerTokenFilledAmount = decodedLog.takerTokenFilledAmount;

    return otcOrderFillEvent;
}

export function parseNativeFillFromV4OtcOrderFilledEvent(eventLog: RawLogEntry): NativeFill {
    const nativeFill = new NativeFill();
    parseEvent(eventLog, nativeFill);
    // decode the basic info directly into nativeFill

    const decodedLog = abiCoder.decodeLog(OTC_ORDER_FILLED_ABI.inputs, eventLog.data);

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
    nativeFill.pool = null;

    nativeFill.nativeOrderType = 'OTC Order';
    nativeFill.protocolVersion = 'v4';

    return nativeFill;
}
