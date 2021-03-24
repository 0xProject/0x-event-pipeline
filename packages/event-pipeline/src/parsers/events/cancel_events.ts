import { LogWithDecodedArgs } from 'ethereum-types';
import { ExchangeCancelEventArgs, ExchangeCancelUpToEventArgs } from '@0x/contract-wrappers';

import { AssetProxyId } from '@0x/types';
import { convertAssetProxyIdToType } from '../../utils';
import { assetDataUtils } from '@0x/order-utils';

import { CancelEvent, CancelUpToEvent } from '../../entities';
import { parseEvent } from './parse_event';

import { parse0xAssetTokenAddress } from '../utils/asset_data_utils';

/**
 * Converts a raw event log for a fill event into an ExchangeFillEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseCancelEvent(eventLog: LogWithDecodedArgs<ExchangeCancelEventArgs>): CancelEvent {
    const cancelEvent = new CancelEvent();
    parseEvent(eventLog, cancelEvent);

    // Asset data could be invalid, wrap it in a try-except
    try {
        const makerAssetData = assetDataUtils.decodeAssetDataOrThrow(eventLog.args.makerAssetData);
        const takerAssetData = assetDataUtils.decodeAssetDataOrThrow(eventLog.args.takerAssetData);

        // tslint:disable-next-line:no-unnecessary-type-assertion
        cancelEvent.makerProxyType = convertAssetProxyIdToType(makerAssetData.assetProxyId as AssetProxyId);
        cancelEvent.makerTokenAddress = parse0xAssetTokenAddress(makerAssetData);
        cancelEvent.makerAssetProxyId = makerAssetData.assetProxyId;

        // tslint:disable-next-line:no-unnecessary-type-assertion
        cancelEvent.takerProxyType = convertAssetProxyIdToType(takerAssetData.assetProxyId as AssetProxyId);
        cancelEvent.takerAssetProxyId = takerAssetData.assetProxyId;
        cancelEvent.takerTokenAddress = parse0xAssetTokenAddress(takerAssetData);
    } catch {
        cancelEvent.makerProxyType = null;
        cancelEvent.makerTokenAddress = null;
        cancelEvent.makerAssetProxyId = null;
        cancelEvent.takerProxyType = null;
        cancelEvent.takerAssetProxyId = null;
        cancelEvent.takerTokenAddress = null;
    }

    // fields taken straight from the log args
    cancelEvent.makerAddress = eventLog.args.makerAddress;
    cancelEvent.feeRecipientAddress = eventLog.args.feeRecipientAddress;
    cancelEvent.senderAddress = eventLog.args.senderAddress;
    cancelEvent.orderHash = eventLog.args.orderHash;
    cancelEvent.rawMakerAssetData = eventLog.args.makerAssetData;
    cancelEvent.rawTakerAssetData = eventLog.args.takerAssetData;

    return cancelEvent;
}

/**
 * Converts a raw event log for a fill event into an ExchangeFillEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseCancelUpToEvent(eventLog: LogWithDecodedArgs<ExchangeCancelUpToEventArgs>): CancelUpToEvent {
    const cancelUpToEvent = new CancelUpToEvent();
    parseEvent(eventLog, cancelUpToEvent);

    cancelUpToEvent.makerAddress = eventLog.args.makerAddress;
    cancelUpToEvent.senderAddress = eventLog.args.orderSenderAddress;
    cancelUpToEvent.orderEpoch = eventLog.args.orderEpoch;

    return cancelUpToEvent;
}
