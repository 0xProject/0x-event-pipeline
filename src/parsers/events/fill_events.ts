import { V3_FILL_ABI } from '../../constants';
import { FillEvent } from '../../entities';
import { NativeFill } from '../../entities';
import { convertAssetProxyIdToType } from '../../utils/proxyType';
import { parse0xAssetTokenAddress, parseV30xBridgeAddress } from '../utils/asset_data_utils';
import { parseEvent } from './parse_event';
import { assetDataUtils } from '@0x/order-utils';
import { AssetProxyId } from '@0x/types';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

/**
 * Parses raw event logs for a fill event and returns an array of
 * FillEvent entities.
 * @param eventLogs Raw event logs (e.g. returned from contract-wrappers).
 */
// export function parseFillEvents(eventLogs: LogWithDecodedArgs<ExchangeFillEventArgs>[]): FillEvent[] {
//     return eventLogs.map(fill => parseFillEvent(fill))
// }

export type ExchangeEvent = FillEvent;

/**
 * Converts a raw event log for a fill event into an ExchangeFillEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */

export function parseFillEvent(eventLog: LogEntry): FillEvent {
    const fillEvent = new FillEvent();
    parseEvent(eventLog, fillEvent);

    const decodedLog = abiCoder.decodeLog(
        V3_FILL_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    const makerAssetData = assetDataUtils.decodeAssetDataOrThrow(decodedLog.makerAssetData);
    const makerFeeAssetData =
        decodedLog.makerFeeAssetData === '0x' || Number(decodedLog.makerFeeAssetData) === 0
            ? null
            : assetDataUtils.decodeAssetDataOrThrow(decodedLog.makerFeeAssetData);
    const takerAssetData = assetDataUtils.decodeAssetDataOrThrow(decodedLog.takerAssetData);
    const takerFeeAssetData =
        decodedLog.takerFeeAssetData === '0x' || Number(decodedLog.takerFeeAssetData) === 0
            ? null
            : assetDataUtils.decodeAssetDataOrThrow(decodedLog.takerFeeAssetData);

    fillEvent.makerAddress = decodedLog.makerAddress.toLowerCase();
    fillEvent.takerAddress = decodedLog.takerAddress.toLowerCase();
    fillEvent.feeRecipientAddress = decodedLog.feeRecipientAddress.toLowerCase();
    fillEvent.senderAddress = decodedLog.senderAddress.toLowerCase();
    fillEvent.makerAssetFilledAmount = decodedLog.makerAssetFilledAmount;
    fillEvent.takerAssetFilledAmount = decodedLog.takerAssetFilledAmount;
    fillEvent.orderHash = decodedLog.orderHash.toLowerCase();
    fillEvent.rawMakerAssetData = decodedLog.makerAssetData;
    fillEvent.makerProxyType = convertAssetProxyIdToType(makerAssetData.assetProxyId as AssetProxyId);
    fillEvent.makerProxyId = makerAssetData.assetProxyId;
    fillEvent.makerTokenAddress = parse0xAssetTokenAddress(makerAssetData);
    fillEvent.rawTakerAssetData = decodedLog.takerAssetData;
    fillEvent.takerProxyType = convertAssetProxyIdToType(takerAssetData.assetProxyId as AssetProxyId);
    fillEvent.takerAssetProxyId = takerAssetData.assetProxyId;
    fillEvent.takerTokenAddress = parse0xAssetTokenAddress(takerAssetData);

    // fees
    fillEvent.makerFeePaid = decodedLog.makerFeePaid;
    fillEvent.takerFeePaid = decodedLog.takerFeePaid;
    fillEvent.makerFeeProxyType =
        makerFeeAssetData === null ? null : convertAssetProxyIdToType(makerFeeAssetData.assetProxyId as AssetProxyId);
    fillEvent.makerFeeTokenAddress = makerFeeAssetData === null ? null : parse0xAssetTokenAddress(makerFeeAssetData);
    fillEvent.takerFeeProxyType =
        takerFeeAssetData === null ? null : convertAssetProxyIdToType(takerFeeAssetData.assetProxyId as AssetProxyId);
    fillEvent.takerFeeTokenAddress = takerFeeAssetData === null ? null : parse0xAssetTokenAddress(takerFeeAssetData);

    fillEvent.protocolFeePaid = decodedLog.protocolFeePaid;

    // ERC20 Bridge-Specific Items
    fillEvent.takerBridgeAddress = parseV30xBridgeAddress(takerAssetData);
    fillEvent.makerBridgeAddress = parseV30xBridgeAddress(makerAssetData);

    return fillEvent;
}

export function parseNativeFillFromFillEvent(eventLog: LogEntry): NativeFill {
    const nativeFill = new NativeFill();
    parseEvent(eventLog, nativeFill);

    const decodedLog = abiCoder.decodeLog(
        V3_FILL_ABI.inputs,
        eventLog.data,
        eventLog.topics.slice(1, eventLog.topics.length),
    );

    const makerAssetData = assetDataUtils.decodeAssetDataOrThrow(decodedLog.makerAssetData);
    const takerAssetData = assetDataUtils.decodeAssetDataOrThrow(decodedLog.takerAssetData);

    nativeFill.orderHash = decodedLog.orderHash.toLowerCase();
    nativeFill.maker = decodedLog.makerAddress.toLowerCase();
    nativeFill.taker = decodedLog.takerAddress.toLowerCase();
    nativeFill.feeRecipient = decodedLog.feeRecipientAddress.toLowerCase();
    nativeFill.makerTokenFilledAmount = decodedLog.makerAssetFilledAmount;
    nativeFill.takerTokenFilledAmount = decodedLog.takerAssetFilledAmount;
    nativeFill.makerProxyType = convertAssetProxyIdToType(makerAssetData.assetProxyId as AssetProxyId);
    nativeFill.takerProxyType = convertAssetProxyIdToType(takerAssetData.assetProxyId as AssetProxyId);
    nativeFill.makerToken = parse0xAssetTokenAddress(makerAssetData);
    nativeFill.takerToken = parse0xAssetTokenAddress(takerAssetData);
    nativeFill.takerFeePaid = decodedLog.takerFeePaid;
    nativeFill.makerFeePaid = decodedLog.makerFeePaid;
    nativeFill.protocolFeePaid = decodedLog.protocolFeePaid;
    nativeFill.pool = null;
    nativeFill.nativeOrderType = null;
    nativeFill.protocolVersion = 'v3';

    return nativeFill;
}
