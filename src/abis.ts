export const EXPIRED_RFQ_ORDER_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'bytes32',
            name: 'orderHash',
            type: 'bytes32',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'maker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint64',
            name: 'expiry',
            type: 'uint64',
        },
    ],
    name: 'ExpiredRfqOrder',
    type: 'event',
};

export const V4_CANCEL_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'bytes32',
            name: 'orderHash',
            type: 'bytes32',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'maker',
            type: 'address',
        },
    ],
    name: 'OrderCancelled',
    type: 'event',
};

export const TRANSFORMED_ERC20_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: 'address',
            name: 'taker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'inputToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'outputToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'inputTokenAmount',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'outputTokenAmount',
            type: 'uint256',
        },
    ],
    name: 'TransformedERC20',
    type: 'event',
};

export const LIQUIDITY_PROVIDER_SWAP_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'address',
            name: 'inputToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'outputToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'inputTokenAmount',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'outputTokenAmount',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'provider',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'recipient',
            type: 'address',
        },
    ],
    name: 'LiquidityProviderSwap',
    type: 'event',
};

export const RFQ_ORDER_FILLED_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'bytes32',
            name: 'orderHash',
            type: 'bytes32',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'maker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'taker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'makerToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'takerToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint128',
            name: 'takerTokenFilledAmount',
            type: 'uint128',
        },
        {
            indexed: false,
            internalType: 'uint128',
            name: 'makerTokenFilledAmount',
            type: 'uint128',
        },
        {
            indexed: false,
            internalType: 'bytes32',
            name: 'pool',
            type: 'bytes32',
        },
    ],
    name: 'RfqOrderFilled',
    type: 'event',
};

export const LIMIT_ORDER_FILLED_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'bytes32',
            name: 'orderHash',
            type: 'bytes32',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'maker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'taker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'feeRecipient',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'makerToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'takerToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint128',
            name: 'takerTokenFilledAmount',
            type: 'uint128',
        },
        {
            indexed: false,
            internalType: 'uint128',
            name: 'makerTokenFilledAmount',
            type: 'uint128',
        },
        {
            indexed: false,
            internalType: 'uint128',
            name: 'takerTokenFeeFilledAmount',
            type: 'uint128',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'protocolFeePaid',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'bytes32',
            name: 'pool',
            type: 'bytes32',
        },
    ],
    name: 'LimitOrderFilled',
    type: 'event',
};

export const UNISWAP_V2_SWAP_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount0In',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount1In',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount0Out',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'amount1Out',
            type: 'uint256',
        },
        {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
        },
    ],
    name: 'Swap',
    type: 'event',
};

export const BRIDGE_FILL_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'bytes32',
            name: 'source',
            type: 'bytes32',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'inputToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'outputToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'inputTokenAmount',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'outputTokenAmount',
            type: 'uint256',
        },
    ],
    name: 'BridgeFill',
    type: 'event',
};

export const V3_FILL_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: 'address',
            name: 'makerAddress',
            type: 'address',
        },
        {
            indexed: true,
            internalType: 'address',
            name: 'feeRecipientAddress',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'bytes',
            name: 'makerAssetData',
            type: 'bytes',
        },
        {
            indexed: false,
            internalType: 'bytes',
            name: 'takerAssetData',
            type: 'bytes',
        },
        {
            indexed: false,
            internalType: 'bytes',
            name: 'makerFeeAssetData',
            type: 'bytes',
        },
        {
            indexed: false,
            internalType: 'bytes',
            name: 'takerFeeAssetData',
            type: 'bytes',
        },
        {
            indexed: true,
            internalType: 'bytes32',
            name: 'orderHash',
            type: 'bytes32',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'takerAddress',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'senderAddress',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'makerAssetFilledAmount',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'takerAssetFilledAmount',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'makerFeePaid',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'takerFeePaid',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'protocolFeePaid',
            type: 'uint256',
        },
    ],
    name: 'Fill',
    type: 'event',
};

export const UNISWAP_V3_SWAP_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
        },
        {
            indexed: true,
            internalType: 'address',
            name: 'recipient',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'int256',
            name: 'amount0',
            type: 'int256',
        },
        {
            indexed: false,
            internalType: 'int256',
            name: 'amount1',
            type: 'int256',
        },
        {
            indexed: false,
            internalType: 'uint160',
            name: 'sqrtPriceX96',
            type: 'uint160',
        },
        {
            indexed: false,
            internalType: 'uint128',
            name: 'liquidity',
            type: 'uint128',
        },
        {
            indexed: false,
            internalType: 'int24',
            name: 'tick',
            type: 'int24',
        },
    ],
    name: 'Swap',
    type: 'event',
};

export const OTC_ORDER_FILLED_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'bytes32',
            name: 'orderHash',
            type: 'bytes32',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'maker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'taker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'makerToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'takerToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint128',
            name: 'makerTokenFilledAmount',
            type: 'uint128',
        },
        {
            indexed: false,
            internalType: 'uint128',
            name: 'takerTokenFilledAmount',
            type: 'uint128',
        },
    ],
    name: 'OtcOrderFilled',
    type: 'event',
};

export const ERC721_ORDER_FILLED_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'enum LibNFTOrder.TradeDirection',
            name: 'direction',
            type: 'uint8',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'maker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'taker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'contract IERC20TokenV06',
            name: 'erc20Token',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'erc20TokenAmount',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'contract IERC721Token',
            name: 'erc721Token',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'erc721TokenId',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'matcher',
            type: 'address',
        },
    ],
    name: 'ERC721OrderFilled',
    type: 'event',
};

export const ERC721_ORDER_CANCELLED_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'address',
            name: 'maker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
        },
    ],
    name: 'ERC721OrderCancelled',
    type: 'event',
};

export const ERC721_ORDER_PRESIGNED_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'enum LibNFTOrder.TradeDirection',
            name: 'direction',
            type: 'uint8',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'maker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'taker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'expiry',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'contract IERC20TokenV06',
            name: 'erc20Token',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'erc20TokenAmount',
            type: 'uint256',
        },
        {
            components: [
                {
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes',
                    name: 'feeData',
                    type: 'bytes',
                },
            ],
            indexed: false,
            internalType: 'struct LibNFTOrder.Fee[]',
            name: 'fees',
            type: 'tuple[]',
        },
        {
            indexed: false,
            internalType: 'contract IERC721Token',
            name: 'erc721Token',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'erc721TokenId',
            type: 'uint256',
        },
        {
            components: [
                {
                    internalType: 'contract IPropertyValidator',
                    name: 'propertyValidator',
                    type: 'address',
                },
                {
                    internalType: 'bytes',
                    name: 'propertyData',
                    type: 'bytes',
                },
            ],
            indexed: false,
            internalType: 'struct LibNFTOrder.Property[]',
            name: 'erc721TokenProperties',
            type: 'tuple[]',
        },
    ],
    name: 'ERC721OrderPreSigned',
    type: 'event',
};

export const ERC1155_ORDER_FILLED_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'enum LibNFTOrder.TradeDirection',
            name: 'direction',
            type: 'uint8',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'maker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'taker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'contract IERC20TokenV06',
            name: 'erc20Token',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'erc20FillAmount',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'contract IERC1155Token',
            name: 'erc1155Token',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'erc1155TokenId',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint128',
            name: 'erc1155FillAmount',
            type: 'uint128',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'matcher',
            type: 'address',
        },
    ],
    name: 'ERC1155OrderFilled',
    type: 'event',
};

export const ERC1155_ORDER_CANCELLED_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'bytes32',
            name: 'orderHash',
            type: 'bytes32',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'maker',
            type: 'address',
        },
    ],
    name: 'ERC1155OrderCancelled',
    type: 'event',
};

export const ERC1155_ORDER_PRESIGNED_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'enum LibNFTOrder.TradeDirection',
            name: 'direction',
            type: 'uint8',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'maker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'address',
            name: 'taker',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'expiry',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'contract IERC20TokenV06',
            name: 'erc20Token',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'erc20TokenAmount',
            type: 'uint256',
        },
        {
            components: [
                {
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes',
                    name: 'feeData',
                    type: 'bytes',
                },
            ],
            indexed: false,
            internalType: 'struct LibNFTOrder.Fee[]',
            name: 'fees',
            type: 'tuple[]',
        },
        {
            indexed: false,
            internalType: 'contract IERC1155Token',
            name: 'erc1155Token',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'erc1155TokenId',
            type: 'uint256',
        },
        {
            components: [
                {
                    internalType: 'contract IPropertyValidator',
                    name: 'propertyValidator',
                    type: 'address',
                },
                {
                    internalType: 'bytes',
                    name: 'propertyData',
                    type: 'bytes',
                },
            ],
            indexed: false,
            internalType: 'struct LibNFTOrder.Property[]',
            name: 'erc1155TokenProperties',
            type: 'tuple[]',
        },
        {
            indexed: false,
            internalType: 'uint128',
            name: 'erc1155TokenAmount',
            type: 'uint128',
        },
    ],
    name: 'ERC1155OrderPreSigned',
    type: 'event',
};

export const LOG_TRANSFER_ABI = {
    anonymous: false,
    inputs: [
        { indexed: true, internalType: 'address', name: 'token', type: 'address' },
        { indexed: true, internalType: 'address', name: 'from', type: 'address' },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'input1', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'input2', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'output1', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'output2', type: 'uint256' },
    ],
    name: 'LogTransfer',
    type: 'event',
};

export const UNISWAP_V2_PAIR_CREATED_ABI = {
    anonymous: false,
    inputs: [
        { indexed: true, internalType: 'address', name: 'token0', type: 'address' },
        { indexed: true, internalType: 'address', name: 'token1', type: 'address' },
        { indexed: false, internalType: 'address', name: 'pair', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'pairFactoryCounter', type: 'uint256' },
    ],
    name: 'PairCreated',
    type: 'event',
};

export const UNISWAP_V2_SYNC_ABI = {
    anonymous: false,
    inputs: [
        { indexed: false, internalType: 'uint112', name: 'reserve0', type: 'uint112' },
        { indexed: false, internalType: 'uint112', name: 'reserve1', type: 'uint112' },
    ],
    name: 'Sync',
    type: 'event',
};

export const META_TRANSACTION_EXECUTED_ABI = {
    anonymous: false,
    inputs: [
        { indexed: false, internalType: 'bytes32', name: 'hash', type: 'bytes32' },
        { indexed: true, internalType: 'bytes4', name: 'selector', type: 'bytes4' },
        { indexed: false, internalType: 'address', name: 'signer', type: 'address' },
        { indexed: false, internalType: 'address', name: 'sender', type: 'address' },
    ],
    name: 'MetaTransactionExecuted',
    type: 'event',
};
