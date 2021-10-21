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

export const SWAP_ABI = {
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

export const ONEINCH_SWAPPED_ABI = {
    anonymous: false,
    inputs: [
        { indexed: false, internalType: 'address', name: 'sender', type: 'address' },
        { indexed: false, internalType: 'contract IERC20', name: 'srcToken', type: 'address' },
        { indexed: false, internalType: 'contract IERC20', name: 'dstToken', type: 'address' },
        { indexed: false, internalType: 'address', name: 'dstReceiver', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'spentAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    name: 'Swapped',
    type: 'event',
};

// https://github.com/code-423n4/2021-02-slingshot/blob/main/contracts/Slingshot.sol
export const SLINGSHOT_TRADE_ABI = {
    anonymous: false,
    inputs: [
        { indexed: true, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'address', name: 'fromToken', type: 'address' },
        { indexed: false, internalType: 'address', name: 'toToken', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'fromAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'toAmount', type: 'uint256' },
        { indexed: false, internalType: 'address', name: 'recipient', type: 'address' },
    ],
    name: 'Trade',
    type: 'event',
};

export const PARASWAP_SWAPPED_V4_ABI = {
    anonymous: false,
    inputs: [
        { indexed: false, internalType: 'address', name: 'initiator', type: 'address' },
        { indexed: true, internalType: 'address', name: 'beneficiary', type: 'address' },
        { indexed: true, internalType: 'address', name: 'srcToken', type: 'address' },
        { indexed: true, internalType: 'address', name: 'destToken', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'srcAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'receivedAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'expectedAmount', type: 'uint256' },
        { indexed: false, internalType: 'string', name: 'referrer', type: 'string' },
    ],
    name: 'Swapped',
    type: 'event',
};

export const PARASWAP_SWAPPED_V5_ABI = {
    anonymous: false,
    inputs: [
        { indexed: false, internalType: 'bytes16', name: 'uuid', type: 'bytes16' },
        { indexed: false, internalType: 'address', name: 'initiator', type: 'address' },
        { indexed: true, internalType: 'address', name: 'beneficiary', type: 'address' },
        { indexed: true, internalType: 'address', name: 'srcToken', type: 'address' },
        { indexed: true, internalType: 'address', name: 'destToken', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'srcAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'receivedAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'expectedAmount', type: 'uint256' },
    ],
    name: 'Swapped',
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

export const SWAP_V3_ABI = {
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

export const TIMECHAIN_SWAP_V1_ABI = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'address',
            name: 'trader',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'contract IERC20',
            name: 'srcToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'contract IERC20',
            name: 'dstToken',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'srcAmount',
            type: 'uint256',
        },
        {
            indexed: false,
            internalType: 'uint256',
            name: 'dstAmount',
            type: 'uint256',
        },
    ],
    name: 'Swap',
    type: 'event',
};

export const OPEN_OCEAN_SWAPPED_V1_ABI = {
    anonymous: false,
    inputs: [
        { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
        { indexed: true, internalType: 'contract IERC20', name: 'srcToken', type: 'address' },
        { indexed: true, internalType: 'contract IERC20', name: 'dstToken', type: 'address' },
        { indexed: false, internalType: 'address', name: 'dstReceiver', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'spentAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'minReturnAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'guaranteedAmount', type: 'uint256' },
        { indexed: false, internalType: 'address', name: 'referrer', type: 'address' },
    ],
    name: 'Swapped',
    type: 'event',
};
