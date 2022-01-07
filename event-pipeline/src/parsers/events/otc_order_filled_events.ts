import { assetDataUtils } from '@0x/order-utils';
import { AssetProxyId } from '@0x/types';
import { RawLogEntry } from 'ethereum-types';

import { OtcOrderFilledEvent } from '../../entities';
import { convertAssetProxyIdToType } from '../../utils';
import { parseEvent } from './parse_event';
import { OTC_ORDER_FILLED_ABI } from '../../constants';

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
