import { V3_CANCEL_ABI, V3_CANCEL_UP_TO_ABI } from '../../constants';
import { CancelEvent, CancelUpToEvent } from '../../entities';
import { convertAssetProxyIdToType } from '../../utils/proxyType';
import { parse0xAssetTokenAddress } from '../utils/asset_data_utils';
import { parseEvent } from './parse_event';
import { assetDataUtils } from '@0x/order-utils';
import { AssetProxyId } from '@0x/types';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

/**
 * Converts a raw event log for a fill event into an ExchangeFillEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseCancelEvent(eventLog: LogEntry): CancelEvent {
    const cancelEvent = new CancelEvent();
    parseEvent(eventLog, cancelEvent);

    const decodedLog = abiCoder.decodeLog(V3_CANCEL_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    // Asset data could be invalid, wrap it in a try-except
    try {
        const makerAssetData = assetDataUtils.decodeAssetDataOrThrow(decodedLog.makerAssetData);
        const takerAssetData = assetDataUtils.decodeAssetDataOrThrow(decodedLog.takerAssetData);

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
    cancelEvent.makerAddress = decodedLog.makerAddress;
    cancelEvent.feeRecipientAddress = decodedLog.feeRecipientAddress;
    cancelEvent.senderAddress = decodedLog.senderAddress;
    cancelEvent.orderHash = decodedLog.orderHash;
    cancelEvent.rawMakerAssetData = decodedLog.makerAssetData;
    cancelEvent.rawTakerAssetData = decodedLog.takerAssetData;

    return cancelEvent;
}

/**
 * Converts a raw event log for a fill event into an ExchangeFillEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function parseCancelUpToEvent(eventLog: LogEntry): CancelUpToEvent {
    const cancelUpToEvent = new CancelUpToEvent();
    parseEvent(eventLog, cancelUpToEvent);

    const decodedLog = abiCoder.decodeLog(V3_CANCEL_UP_TO_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    cancelUpToEvent.makerAddress = decodedLog.makerAddress.toLowerCase();
    cancelUpToEvent.senderAddress = decodedLog.orderSenderAddress.toLowerCase();
    cancelUpToEvent.orderEpoch = decodedLog.orderEpoch;

    return cancelUpToEvent;
}
