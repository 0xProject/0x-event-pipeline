import { AssetProxyId } from '@0x/types';

import { ProxyType } from '../../types';

/**
 * Converts an assetProxyId to its string equivalent
 * @param assetProxyId Id of AssetProxy
 */
export function convertAssetProxyIdToType(assetProxyId: AssetProxyId): ProxyType {
    switch (assetProxyId) {
        case AssetProxyId.ERC20:
            return ProxyType.ERC20;
        case AssetProxyId.ERC721:
            return ProxyType.ERC721;
        case AssetProxyId.MultiAsset: 
            return ProxyType.MultiAsset;
        case AssetProxyId.StaticCall:
            return ProxyType.StaticCall;
        case AssetProxyId.ERC1155:
            return ProxyType.ERC1155;
        case AssetProxyId.ERC20Bridge:
            return ProxyType.ERC20Bridge;
        default:
            throw new Error(`${assetProxyId} not a supported assetProxyId`);
    }
}
