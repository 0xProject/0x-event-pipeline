import { Producer } from 'kafkajs';
import { Connection } from 'typeorm';
import { Web3Source } from './data_sources/events/web3';
import { RawLogEntry } from 'ethereum-types';

import {
    ERC20BridgeTransferEvent,
    Erc1155OrderCancelledEvent,
    Erc1155OrderFilledEvent,
    Erc1155OrderPresignedEvent,
    Erc721OrderCancelledEvent,
    Erc721OrderFilledEvent,
    Erc721OrderPresignedEvent,
    ExpiredRfqOrderEvent,
    FillEvent,
    LogTransferEvent,
    MetaTransactionExecutedEvent,
    NativeFill,
    OnchainGovernanceCallScheduledEvent,
    OnchainGovernanceProposalCreatedEvent,
    OtcOrderFilledEvent,
    TransformedERC20Event,
    UniswapV2PairCreatedEvent,
    UniswapV2SyncEvent,
    UniswapV3SwapEvent,
    V4CancelEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
} from './entities';

import {
    EP_ADDRESS,
    EP_DEPLOYMENT_BLOCK,
    FEAT_ERC20_BRIDGE_TRANSFER_FLASHWALLET,
    FEAT_LIMIT_ORDERS,
    FEAT_META_TRANSACTION_EXECUTED_EVENT,
    FEAT_NFT,
    FEAT_ONCHAIN_GOVERNANCE,
    FEAT_OTC_ORDERS,
    FEAT_POLYGON_RFQM_PAYMENTS,
    FEAT_RFQ_EVENT,
    FEAT_TRANSFORMED_ERC20_EVENT,
    FEAT_UNISWAP_V2_PAIR_CREATED_EVENT,
    FEAT_UNISWAP_V2_SYNC_EVENT,
    FEAT_UNISWAP_V2_VIP_SWAP_EVENT,
    FEAT_UNISWAP_V3_SWAP_EVENT,
    FEAT_UNISWAP_V3_VIP_SWAP_EVENT,
    FEAT_V3_FILL_EVENT,
    FEAT_V3_NATIVE_FILL,
    FIRST_SEARCH_BLOCK,
    FLASHWALLET_ADDRESS,
    FLASHWALLET_DEPLOYMENT_BLOCK,
    META_TRANSACTION_EXECUTED_START_BLOCK,
    NFT_FEATURE_START_BLOCK,
    ONCHAIN_GOVERNANCE_START_BLOCK,
    OTC_ORDERS_FEATURE_START_BLOCK,
    POLYGON_RFQM_PAYMENTS_ADDRESSES,
    POLYGON_RFQM_PAYMENTS_START_BLOCK,
    UNISWAP_V2_PAIR_CREATED_PROTOCOL_CONTRACT_ADDRESSES_AND_START_BLOCKS,
    UNISWAP_V2_SYNC_START_BLOCK,
    UNISWAP_V2_VIP_SWAP_SOURCES,
    UNISWAP_V2_VIP_SWAP_START_BLOCK,
    UNISWAP_V3_SWAP_START_BLOCK,
    UNISWAP_V3_VIP_SWAP_START_BLOCK,
    V4_NATIVE_FILL_START_BLOCK,
} from './config';
import {
    BRIDGEFILL_EVENT_TOPIC,
    ERC1155_ORDER_CANCELLED_EVENT_TOPIC,
    ERC1155_ORDER_FILLED_EVENT_TOPIC,
    ERC1155_ORDER_PRESIGNED_EVENT_TOPIC,
    ERC721_ORDER_CANCELLED_EVENT_TOPIC,
    ERC721_ORDER_FILLED_EVENT_TOPIC,
    ERC721_ORDER_PRESIGNED_EVENT_TOPIC,
    EXPIRED_RFQ_ORDER_EVENT_TOPIC,
    LIMITORDERFILLED_EVENT_TOPIC,
    LOG_TRANSFER_EVENT_TOPIC_0,
    META_TRANSACTION_EXECUTED_EVENT_TOPIC,
    ONCHAIN_GOVERNANCE_CALL_SCHEDULED_EVENT_TOPIC,
    ONCHAIN_GOVERNANCE_PROPOSAL_CREATED_EVENT_TOPIC,
    OTC_ORDER_FILLED_EVENT_TOPIC,
    POLYGON_MATIC_ADDRESS,
    PROTOCOL_ZEROEX_TIMELOCK_CONTRACT_ADDRESS,
    RFQ_ORDER_FILLED_EVENT_TOPIC,
    TRANSFORMEDERC20_EVENT_TOPIC,
    TREASURY_ZEROEX_TIMELOCK_CONTRACT_ADDRESS,
    UNISWAP_V2_PAIR_CREATED_TOPIC,
    UNISWAP_V2_SWAP_EVENT_TOPIC_0,
    UNISWAP_V2_SYNC_TOPIC,
    UNISWAP_V3_SWAP_EVENT_TOPIC_0,
    V3_EXCHANGE_ADDRESS,
    V3_FILL_EVENT_TOPIC,
    V4_CANCEL_EVENT_TOPIC,
    ZEROEX_PROTOCOL_GOVERNOR_CONTRACT_ADDRESS,
    ZEROEX_TREASURY_GOVERNOR_CONTRACT_ADDRESS,
} from './constants';

import { DeleteOptions } from './scripts/utils/event_abi_utils';
import { parseTransformedERC20Event } from './parsers/events/transformed_erc20_events';
import {
    parseNativeFillFromV4RfqOrderFilledEvent,
    parseV4RfqOrderFilledEvent,
} from './parsers/events/v4_rfq_order_filled_events';
import { parseUniswapV3VIPSwapEvent, parseUniswapV3SwapEvent } from './parsers/events/uniswap_v3_events';
import {
    parseNativeFillFromV4LimitOrderFilledEvent,
    parseV4LimitOrderFilledEvent,
} from './parsers/events/v4_limit_order_filled_events';
import { parseFillEvent } from './parsers/events/fill_events';
import { parseNativeFillFromFillEvent } from './parsers/events/fill_events';
import { parseV4CancelEvent } from './parsers/events/v4_cancel_events';
import { parseExpiredRfqOrderEvent } from './parsers/events/expired_rfq_order_events';
import {
    parseNativeFillFromV4OtcOrderFilledEvent,
    parseOtcOrderFilledEvent,
} from './parsers/events/otc_order_filled_events';
import {
    parseUniswapV2SwapEvent,
    parseUniswapV2SyncEvent,
    parseUniswapV2PairCreatedEvent,
} from './parsers/events/uniswap_v2_events';
import {
    parseErc1155OrderCancelledEvent,
    parseErc1155OrderFilledEvent,
    parseErc1155OrderPresignedEvent,
    parseErc721OrderCancelledEvent,
    parseErc721OrderFilledEvent,
    parseErc721OrderPresignedEvent,
} from './parsers/events/nft_events';

import { parseBridgeFill } from './parsers/events/bridge_transfer_events';
import { parseLogTransferEvent } from './parsers/events/log_transfer_events';
import { parseMetaTransactionExecutedEvent } from './parsers/events/meta_transaction_executed_events';

import {
    parseOnchainGovernanceProposalCreatedEvent,
    parseOnchainGovernanceCallScheduledEvent,
} from './parsers/events/onchain_governance_events';

import { TokenMetadataMap } from './scripts/utils/web3_utils';
import { UniV2PoolSingleton } from './uniV2PoolSingleton';

function uniV2PoolSingletonCallback(pools: UniswapV2PairCreatedEvent[]) {
    const uniV2PoolSingleton = UniV2PoolSingleton.getInstance();
    uniV2PoolSingleton.addNewPools(pools);
}

export type CommonEventParams = {
    connection: Connection;
    producer: Producer;
    web3Source: Web3Source;
};

export type EventScraperProps = {
    enabled: boolean;
    name: string;
    tType: any;
    table: string;
    topics: (string | null)[];
    contractAddress: string;
    startBlock: number;
    parser: (decodedLog: RawLogEntry) => any;
    deleteOptions: DeleteOptions;
    tokenMetadataMap: TokenMetadataMap;
    callback: any | null;
};

export const eventScrperProps: EventScraperProps[] = [
    {
        enabled: FEAT_TRANSFORMED_ERC20_EVENT,
        name: 'TransformedERC20Event',
        tType: TransformedERC20Event,
        table: 'transformed_erc20_events',
        topics: TRANSFORMEDERC20_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: EP_DEPLOYMENT_BLOCK,
        parser: parseTransformedERC20Event,
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_UNISWAP_V3_VIP_SWAP_EVENT,
        name: 'UniswapV3VIPEvent',
        tType: ERC20BridgeTransferEvent,
        table: 'erc20_bridge_transfer_events',
        topics: [UNISWAP_V3_SWAP_EVENT_TOPIC_0, addressToTopic(EP_ADDRESS)],
        contractAddress: 'nofilter',
        startBlock: UNISWAP_V3_VIP_SWAP_START_BLOCK,
        parser: parseUniswapV3VIPSwapEvent,
        deleteOptions: { isDirectTrade: true, directProtocol: ['UniswapV3'] },
        tokenMetadataMap: { tokenA: 'fromToken', tokenB: 'toToken' },
        callback: null,
    },
    {
        enabled: FEAT_ERC20_BRIDGE_TRANSFER_FLASHWALLET,
        name: 'ERC20BridgeTransferFlashwallet',
        tType: ERC20BridgeTransferEvent,
        table: 'erc20_bridge_transfer_events',
        topics: BRIDGEFILL_EVENT_TOPIC,
        contractAddress: FLASHWALLET_ADDRESS,
        startBlock: FLASHWALLET_DEPLOYMENT_BLOCK,
        parser: parseBridgeFill,
        deleteOptions: { isDirectTrade: false },
        tokenMetadataMap: { tokenA: 'fromToken', tokenB: 'toToken' },
        callback: null,
    },
    {
        enabled: FEAT_UNISWAP_V2_VIP_SWAP_EVENT,
        name: 'VIPSwapEvent',
        tType: ERC20BridgeTransferEvent,
        table: 'erc20_bridge_transfer_events',
        topics: [UNISWAP_V2_SWAP_EVENT_TOPIC_0, addressToTopic(EP_ADDRESS)],
        contractAddress: 'nofilter',
        startBlock: UNISWAP_V2_VIP_SWAP_START_BLOCK,
        parser: parseUniswapV2SwapEvent,
        deleteOptions: { isDirectTrade: true, directProtocol: UNISWAP_V2_VIP_SWAP_SOURCES },
        tokenMetadataMap: { tokenA: 'fromToken', tokenB: 'toToken' },
        callback: null,
    },
    {
        enabled: FEAT_UNISWAP_V3_VIP_SWAP_EVENT,
        name: 'UniswapV3VIPEvent',
        tType: ERC20BridgeTransferEvent,
        table: 'erc20_bridge_transfer_events',
        topics: [UNISWAP_V3_SWAP_EVENT_TOPIC_0, addressToTopic(EP_ADDRESS)],
        contractAddress: 'nofilter',
        startBlock: UNISWAP_V3_VIP_SWAP_START_BLOCK,
        parser: parseUniswapV3SwapEvent,
        deleteOptions: { isDirectTrade: true, directProtocol: ['UniswapV3'] },
        tokenMetadataMap: { tokenA: 'fromToken', tokenB: 'toToken' },
        callback: null,
    },
    {
        enabled: FEAT_RFQ_EVENT,
        name: 'V4RfqOrderFilledEvent',
        tType: V4RfqOrderFilledEvent,
        table: 'v4_rfq_order_filled_events',
        topics: RFQ_ORDER_FILLED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: V4_NATIVE_FILL_START_BLOCK,
        parser: parseV4RfqOrderFilledEvent,
        deleteOptions: {},
        tokenMetadataMap: { tokenA: 'makerToken', tokenB: 'takerToken' },
        callback: null,
    },
    {
        enabled: FEAT_RFQ_EVENT,
        name: 'NativeFillFromRFQV4',
        tType: NativeFill,
        table: 'native_fills',
        topics: RFQ_ORDER_FILLED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: V4_NATIVE_FILL_START_BLOCK,
        parser: parseNativeFillFromV4RfqOrderFilledEvent,
        deleteOptions: { protocolVersion: 'v4', nativeOrderType: 'RFQ Order' },
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_RFQ_EVENT,
        name: 'ExpiredRfqOrderEvent',
        tType: ExpiredRfqOrderEvent,
        table: 'expired_rfq_order_events',
        topics: EXPIRED_RFQ_ORDER_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: V4_NATIVE_FILL_START_BLOCK,
        parser: parseExpiredRfqOrderEvent,
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_LIMIT_ORDERS,
        name: 'V4LimitOrderFilledEvent',
        tType: V4LimitOrderFilledEvent,
        table: 'v4_limit_order_filled_events',
        topics: LIMITORDERFILLED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: V4_NATIVE_FILL_START_BLOCK,
        parser: parseV4LimitOrderFilledEvent,
        deleteOptions: {},
        tokenMetadataMap: { tokenA: 'makerToken', tokenB: 'takerToken' },
        callback: null,
    },
    {
        enabled: FEAT_LIMIT_ORDERS,
        name: 'NativeFillFromLimitV4',
        tType: NativeFill,
        table: 'native_fills',
        topics: LIMITORDERFILLED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: V4_NATIVE_FILL_START_BLOCK,
        parser: parseNativeFillFromV4LimitOrderFilledEvent,
        deleteOptions: { protocolVersion: 'v4', nativeOrderType: 'Limit Order' },
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_RFQ_EVENT || FEAT_LIMIT_ORDERS,
        name: 'V4CancelEvent',
        tType: V4CancelEvent,
        table: 'v4_cancel_events',
        topics: V4_CANCEL_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: V4_NATIVE_FILL_START_BLOCK,
        parser: parseV4CancelEvent,
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_OTC_ORDERS,
        name: 'OtcOrderFilledEvent',
        tType: OtcOrderFilledEvent,
        table: 'otc_order_filled_events',
        topics: OTC_ORDER_FILLED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: OTC_ORDERS_FEATURE_START_BLOCK,
        parser: parseOtcOrderFilledEvent,
        deleteOptions: {},
        tokenMetadataMap: { tokenA: 'makerTokenAddress', tokenB: 'takerTokenAddress' },
        callback: null,
    },
    {
        enabled: FEAT_OTC_ORDERS,
        name: 'NativeFillFromOTC',
        tType: NativeFill,
        table: 'native_fills',
        topics: OTC_ORDER_FILLED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: OTC_ORDERS_FEATURE_START_BLOCK,
        parser: parseNativeFillFromV4OtcOrderFilledEvent,
        deleteOptions: { protocolVersion: 'v4', nativeOrderType: 'OTC Order' },
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_V3_FILL_EVENT,
        name: 'FillEvent',
        tType: FillEvent,
        table: 'fill_events',
        topics: V3_FILL_EVENT_TOPIC,
        contractAddress: V3_EXCHANGE_ADDRESS,
        startBlock: FIRST_SEARCH_BLOCK,
        parser: parseFillEvent,
        deleteOptions: {},
        tokenMetadataMap: { tokenA: 'makerTokenAddress', tokenB: 'takerTokenAddress' },
        callback: null,
    },
    {
        enabled: FEAT_V3_NATIVE_FILL,
        name: 'NativeFillFromV3',
        tType: NativeFill,
        table: 'native_fills',
        topics: V3_FILL_EVENT_TOPIC,
        contractAddress: V3_EXCHANGE_ADDRESS,
        startBlock: FIRST_SEARCH_BLOCK,
        parser: parseNativeFillFromFillEvent,
        deleteOptions: { protocolVersion: 'v3' },
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_NFT,
        name: 'Erc721OrderFilledEvent',
        tType: Erc721OrderFilledEvent,
        table: 'erc721_order_filled_events',
        topics: ERC721_ORDER_FILLED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: NFT_FEATURE_START_BLOCK,
        parser: parseErc721OrderFilledEvent,
        deleteOptions: {},
        tokenMetadataMap: { tokenA: 'erc20Token', tokenB: 'erc721Token' },
        callback: null,
    },
    {
        enabled: FEAT_NFT,
        name: 'Erc721OrderCancelledEvent',
        tType: Erc721OrderCancelledEvent,
        table: 'erc721_order_cancelled_events',
        topics: ERC721_ORDER_CANCELLED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: NFT_FEATURE_START_BLOCK,
        parser: parseErc721OrderCancelledEvent,
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_NFT,
        name: 'Erc721OrderPresignedEvent',
        tType: Erc721OrderPresignedEvent,
        table: 'erc721_order_presigned_events',
        topics: ERC721_ORDER_PRESIGNED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: NFT_FEATURE_START_BLOCK,
        parser: parseErc721OrderPresignedEvent,
        deleteOptions: {},
        tokenMetadataMap: { tokenA: 'erc20Token', tokenB: 'erc721Token' },
        callback: null,
    },
    {
        enabled: FEAT_NFT,
        name: 'Erc1155OrderFilledEvent',
        tType: Erc1155OrderFilledEvent,
        table: 'erc1155_order_filled_events',
        topics: ERC1155_ORDER_FILLED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: NFT_FEATURE_START_BLOCK,
        parser: parseErc1155OrderFilledEvent,
        deleteOptions: {},
        tokenMetadataMap: { tokenA: 'erc20Token', tokenB: 'erc1155Token' },
        callback: null,
    },
    {
        enabled: FEAT_NFT,
        name: 'Erc1155OrderCancelledEvent',
        tType: Erc1155OrderCancelledEvent,
        table: 'erc1155_order_cancelled_events',
        topics: ERC1155_ORDER_CANCELLED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: NFT_FEATURE_START_BLOCK,
        parser: parseErc1155OrderCancelledEvent,
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_NFT,
        name: 'Erc1155OrderPresignedEvent',
        tType: Erc1155OrderPresignedEvent,
        table: 'erc1155_order_presigned_events',
        topics: ERC1155_ORDER_PRESIGNED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: NFT_FEATURE_START_BLOCK,
        parser: parseErc1155OrderPresignedEvent,
        deleteOptions: {},
        tokenMetadataMap: { tokenA: 'erc20Token', tokenB: 'erc1155Token' },
        callback: null,
    },
    {
        enabled: FEAT_UNISWAP_V2_SYNC_EVENT,
        name: 'UniswapV2SyncEvent',
        tType: UniswapV2SyncEvent,
        table: 'uniswap_v2_sync_events',
        topics: UNISWAP_V2_SYNC_TOPIC,
        contractAddress: 'nofilter',
        startBlock: UNISWAP_V2_SYNC_START_BLOCK,
        parser: parseUniswapV2SyncEvent,
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_META_TRANSACTION_EXECUTED_EVENT,
        name: 'MetaTransactionExecutedEvent',
        tType: MetaTransactionExecutedEvent,
        table: 'meta_transaction_executed_events',
        topics: META_TRANSACTION_EXECUTED_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: META_TRANSACTION_EXECUTED_START_BLOCK,
        parser: parseMetaTransactionExecutedEvent,
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_UNISWAP_V3_SWAP_EVENT,
        name: 'UniswapV3SwapEvent',
        tType: UniswapV3SwapEvent,
        table: 'uniswap_v3_swap_events',
        topics: [UNISWAP_V3_SWAP_EVENT_TOPIC_0],
        contractAddress: 'nofilter',
        startBlock: UNISWAP_V3_SWAP_START_BLOCK,
        parser: parseUniswapV3SwapEvent,
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_ONCHAIN_GOVERNANCE,
        name: 'ZeroexTreasuryGovernorProposalCreatedEvent',
        tType: OnchainGovernanceProposalCreatedEvent,
        table: 'onchain_governance_proposal_created',
        topics: ONCHAIN_GOVERNANCE_PROPOSAL_CREATED_EVENT_TOPIC,
        contractAddress: ZEROEX_TREASURY_GOVERNOR_CONTRACT_ADDRESS,
        startBlock: ONCHAIN_GOVERNANCE_START_BLOCK,
        parser: (decodedLog: RawLogEntry) =>
            parseOnchainGovernanceProposalCreatedEvent(decodedLog, 'ZeroexTreasuryGovernor'),
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_ONCHAIN_GOVERNANCE,

        name: 'ZeroExProtocolGovernorProposalCreatedEvent',
        tType: OnchainGovernanceProposalCreatedEvent,
        table: 'onchain_governance_proposal_created',
        topics: ONCHAIN_GOVERNANCE_PROPOSAL_CREATED_EVENT_TOPIC,
        contractAddress: ZEROEX_PROTOCOL_GOVERNOR_CONTRACT_ADDRESS,
        startBlock: ONCHAIN_GOVERNANCE_START_BLOCK,
        parser: (decodedLog: RawLogEntry) =>
            parseOnchainGovernanceProposalCreatedEvent(decodedLog, 'ZeroexProtocolGovernor'),
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_ONCHAIN_GOVERNANCE,
        name: 'TreasuryZeroexTimelockCallScheduledEvent',
        tType: OnchainGovernanceCallScheduledEvent,
        table: 'onchain_governance_call_scheduled',
        topics: ONCHAIN_GOVERNANCE_CALL_SCHEDULED_EVENT_TOPIC,
        contractAddress: TREASURY_ZEROEX_TIMELOCK_CONTRACT_ADDRESS,
        startBlock: ONCHAIN_GOVERNANCE_START_BLOCK,
        parser: (decodedLog: RawLogEntry) =>
            parseOnchainGovernanceCallScheduledEvent(decodedLog, 'TreasuryZeroexTimelock'),
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
    {
        enabled: FEAT_ONCHAIN_GOVERNANCE,
        name: 'ProtocolZeroexTimelockCallScheduledEvent',
        tType: OnchainGovernanceCallScheduledEvent,
        table: 'onchain_governance_call_scheduled',
        topics: ONCHAIN_GOVERNANCE_CALL_SCHEDULED_EVENT_TOPIC,
        contractAddress: PROTOCOL_ZEROEX_TIMELOCK_CONTRACT_ADDRESS,
        startBlock: ONCHAIN_GOVERNANCE_START_BLOCK,
        parser: (decodedLog: RawLogEntry) =>
            parseOnchainGovernanceCallScheduledEvent(decodedLog, 'ProtocolZeroexTimelock'),
        deleteOptions: {},
        tokenMetadataMap: null,
        callback: null,
    },
];

for (const payment_recipient of POLYGON_RFQM_PAYMENTS_ADDRESSES) {
    eventScrperProps.push({
        enabled: FEAT_POLYGON_RFQM_PAYMENTS,
        name: `LogTransferEvent-${payment_recipient}`,
        tType: LogTransferEvent,
        table: 'log_transfer_events',
        topics: [
            LOG_TRANSFER_EVENT_TOPIC_0,
            addressToTopic(POLYGON_MATIC_ADDRESS),
            null,
            addressToTopic(payment_recipient),
        ],
        contractAddress: POLYGON_MATIC_ADDRESS,
        startBlock: POLYGON_RFQM_PAYMENTS_START_BLOCK,
        parser: parseLogTransferEvent,
        deleteOptions: { recipient: payment_recipient },
        tokenMetadataMap: null,
        callback: null,
    });
}

for (const protocol of UNISWAP_V2_PAIR_CREATED_PROTOCOL_CONTRACT_ADDRESSES_AND_START_BLOCKS) {
    eventScrperProps.push({
        enabled: FEAT_UNISWAP_V2_PAIR_CREATED_EVENT,
        name: `UniswapV2PairCreatedEvent-${protocol.name}`,
        tType: UniswapV2PairCreatedEvent,
        table: 'uniswap_v2_pair_created_events',
        topics: UNISWAP_V2_PAIR_CREATED_TOPIC,
        contractAddress: protocol.factoryAddress,
        startBlock: protocol.startBlock,
        parser: (decodedLog: RawLogEntry) => parseUniswapV2PairCreatedEvent(decodedLog, protocol.name),
        deleteOptions: { protocol: protocol.name },
        tokenMetadataMap: { tokenA: 'token0', tokenB: 'token1' },
        callback: uniV2PoolSingletonCallback,
    });
}

export function addressToTopic(address: string): string {
    if (address.length === 42 && address.substring(0, 2) === '0x') {
        return `0x000000000000000000000000${address.substring(2)}`;
    }
    throw new Error(`Error while converting convert ${address} to topic`);
}
