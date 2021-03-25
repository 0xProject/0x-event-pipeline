import { AssetData, AssetProxyId, ERC20BridgeAssetData, MultiAssetData, MultiAssetDataWithRecursiveDecoding, StaticCallAssetData } from '@0x/types';

export function parse0xAssetTokenAddress(
    decodedAssetData: AssetData):
string | null {
    if (isMultiAssetData(decodedAssetData)) {
        return null;
    } else if (isStaticCallAssetData(decodedAssetData)) {
        return null;
    } else {
        return decodedAssetData.tokenAddress.toLowerCase();
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
        return decodedAssetData.bridgeAddress.toLowerCase();
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
