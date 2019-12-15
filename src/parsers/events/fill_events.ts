import { assetDataUtils } from '@0x/order-utils';
import { AssetData, AssetProxyId, ERC20BridgeAssetData, MultiAssetData, MultiAssetDataWithRecursiveDecoding, StaticCallAssetData } from '@0x/types';
import { LogWithDecodedArgs } from 'ethereum-types';
import { ExchangeFillEventArgs } from '@0x/contract-wrappers';

import { FillEvent } from '../../entities';
import { convertAssetProxyIdToType } from '../../utils';
import { parseEvent } from './parse_event';

/**
 * Parses raw event logs for a fill event and returns an array of
 * FillEvent entities.
 * @param eventLogs Raw event logs (e.g. returned from contract-wrappers).
 */
export function parseFillEvents(eventLogs: LogWithDecodedArgs<ExchangeFillEventArgs>[]): FillEvent[] {
    return eventLogs.map(fill => parseFillEvent(fill))
}

export function parse0xAssetTokenAddress(
    decodedAssetData: AssetData):
string | null {
    if (isMultiAssetData(decodedAssetData)) {
        return null;
    } else if (isStaticCallAssetData(decodedAssetData)) {
        return null;
    } else {
        return decodedAssetData.tokenAddress;
    }
}

/**
 * Returns the bridge address if it's ERC20Bridge data
 * @param decodedAssetData decoded 0x asset data
 */
export function parseV30xBridgeAddress(
    decodedAssetData: AssetData):
string | null {
    if (isERC20BridgeAssetData(decodedAssetData)) {
        return decodedAssetData.bridgeAddress;
    } else {
        return null;
    }
}

/**
 * Checks if the asset data is ERC20Bridge Data
 * @param decodedAssetData decoded 0x asset data
 */
export function isERC20BridgeAssetData(decodedAssetData: AssetData): decodedAssetData is ERC20BridgeAssetData {
    return decodedAssetData.assetProxyId === AssetProxyId.ERC20Bridge;
}

/**
 * Checks if the asset data is multi-asset data
 * @param decodedAssetData decoded 0x asset data
 */
export function isMultiAssetData(decodedAssetData: AssetData): decodedAssetData is MultiAssetData | MultiAssetDataWithRecursiveDecoding {
    return decodedAssetData.assetProxyId === AssetProxyId.MultiAsset;
}

/**
 * Checks if the asset data is static call asset data
 * @param decodedAssetData decoded 0x asset data
 */
export function isStaticCallAssetData(decodedAssetData: AssetData): decodedAssetData is StaticCallAssetData {
    return decodedAssetData.assetProxyId === AssetProxyId.StaticCall;
}


export type ExchangeEvent = FillEvent;

/**
 * Converts a raw event log for a fill event into an ExchangeFillEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseFillEvent(eventLog: LogWithDecodedArgs<ExchangeFillEventArgs>): FillEvent {
    const makerAssetData = assetDataUtils.decodeAssetDataOrThrow(eventLog.args.makerAssetData);
    const takerAssetData = assetDataUtils.decodeAssetDataOrThrow(eventLog.args.takerAssetData);

    const makerFeeAssetData = eventLog.args.makerFeeAssetData === '0x' || Number(eventLog.args.makerFeeAssetData) === 0 ?
        null :
        assetDataUtils.decodeAssetDataOrThrow(eventLog.args.makerFeeAssetData);
    const takerFeeAssetData = eventLog.args.takerFeeAssetData === '0x' || Number(eventLog.args.takerFeeAssetData) === 0 ?
        null :
        assetDataUtils.decodeAssetDataOrThrow(eventLog.args.takerFeeAssetData);

    const fillEvent = new FillEvent();
    parseEvent(eventLog, fillEvent);

    fillEvent.makerAddress = eventLog.args.makerAddress;
    fillEvent.takerAddress = eventLog.args.takerAddress;
    fillEvent.feeRecipientAddress = eventLog.args.feeRecipientAddress;
    fillEvent.senderAddress = eventLog.args.senderAddress;
    fillEvent.makerAssetFilledAmount = eventLog.args.makerAssetFilledAmount;
    fillEvent.takerAssetFilledAmount = eventLog.args.takerAssetFilledAmount;
    fillEvent.orderHash = eventLog.args.orderHash;
    fillEvent.rawMakerAssetData = eventLog.args.makerAssetData;
    // tslint:disable-next-line:no-unnecessary-type-assertion
    fillEvent.makerProxyType = convertAssetProxyIdToType(makerAssetData.assetProxyId as AssetProxyId);
    fillEvent.makerProxyId = makerAssetData.assetProxyId;
    fillEvent.makerTokenAddress = parse0xAssetTokenAddress(makerAssetData);
    fillEvent.rawTakerAssetData = eventLog.args.takerAssetData;
    // tslint:disable-next-line:no-unnecessary-type-assertion
    fillEvent.takerProxyType = convertAssetProxyIdToType(takerAssetData.assetProxyId as AssetProxyId);
    fillEvent.takerAssetProxyId = takerAssetData.assetProxyId;
    fillEvent.takerTokenAddress = parse0xAssetTokenAddress(takerAssetData);

    // fees
    fillEvent.makerFeePaid = eventLog.args.makerFeePaid;
    fillEvent.takerFeePaid = eventLog.args.takerFeePaid;
    fillEvent.makerFeeProxyType = makerFeeAssetData === null ?
        null :
        convertAssetProxyIdToType(makerFeeAssetData.assetProxyId as AssetProxyId);
    fillEvent.makerFeeTokenAddress = makerFeeAssetData === null ?
        null :
        parse0xAssetTokenAddress(makerFeeAssetData);
    fillEvent.takerFeeProxyType = takerFeeAssetData === null ?
        null :
        convertAssetProxyIdToType(takerFeeAssetData.assetProxyId as AssetProxyId);
    fillEvent.takerFeeTokenAddress = takerFeeAssetData === null ?
        null :
        parse0xAssetTokenAddress(takerFeeAssetData);

    fillEvent.protocolFeePaid = eventLog.args.protocolFeePaid;

    // ERC20 Bridge-Specific Items
    fillEvent.takerBridgeAddress = parseV30xBridgeAddress(takerAssetData);
    fillEvent.makerBridgeAddress = parseV30xBridgeAddress(makerAssetData);

    return fillEvent;
}
