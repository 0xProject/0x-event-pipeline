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
