import {
    SCHEMA,
    EP_ADDRESS,
    FEAT_STAKING,
    EP_DEPLOYMENT_BLOCK,
    SETTLER_DEPLOYMENT_BLOCK,
    FEAT_ERC20_BRIDGE_TRANSFER_FLASHWALLET,
    FEAT_LIMIT_ORDERS,
    FEAT_META_TRANSACTION_EXECUTED_EVENT,
    FEAT_NFT,
    FEAT_ONCHAIN_GOVERNANCE,
    FEAT_OTC_ORDERS,
    FEAT_PLP_SWAP_EVENT,
    FEAT_POLYGON_RFQM_PAYMENTS,
    FEAT_RFQ_EVENT,
    FEAT_SOCKET_BRIDGE_EVENT,
    FEAT_TRANSFORMED_ERC20_EVENT,
    FEAT_UNISWAP_V2_PAIR_CREATED_EVENT,
    FEAT_UNISWAP_V2_SYNC_EVENT,
    FEAT_UNISWAP_V2_VIP_SWAP_EVENT,
    FEAT_UNISWAP_V3_POOL_CREATED_EVENT,
    FEAT_UNISWAP_V3_SWAP_EVENT,
    FEAT_UNISWAP_V3_VIP_SWAP_EVENT,
    FEAT_V3_CANCEL_EVENTS,
    FEAT_V3_FILL_EVENT,
    FEAT_V3_NATIVE_FILL,
    FEAT_WRAP_UNWRAP_NATIVE_EVENT,
    FEAT_WRAP_UNWRAP_NATIVE_TRANSFER_EVENT,
    FIRST_SEARCH_BLOCK,
    FLASHWALLET_ADDRESS,
    FLASHWALLET_DEPLOYMENT_BLOCK,
    META_TRANSACTION_EXECUTED_START_BLOCK,
    NFT_FEATURE_START_BLOCK,
    ONCHAIN_GOVERNANCE_START_BLOCK,
    OTC_ORDERS_FEATURE_START_BLOCK,
    PLP_VIP_START_BLOCK,
    POLYGON_RFQM_PAYMENTS_ADDRESSES,
    POLYGON_RFQM_PAYMENTS_START_BLOCK,
    SOCKET_BRIDGE_CONTRACT_ADDRESS,
    SOCKET_BRIDGE_EVENT_START_BLOCK,
    UNISWAP_V2_PAIR_CREATED_PROTOCOL_CONTRACT_ADDRESSES_AND_START_BLOCKS,
    UNISWAP_V2_SYNC_START_BLOCK,
    UNISWAP_V2_VIP_SWAP_SOURCES,
    UNISWAP_V2_VIP_SWAP_START_BLOCK,
    UNISWAP_V3_FACTORY_ADDRESS,
    UNISWAP_V3_POOL_CREATED_START_BLOCK,
    UNISWAP_V3_SWAP_START_BLOCK,
    UNISWAP_V3_VIP_SWAP_START_BLOCK,
    V4_NATIVE_FILL_START_BLOCK,
    WRAP_UNWRAP_NATIVE_CONTRACT_ADDRESS,
    WRAP_UNWRAP_NATIVE_START_BLOCK,
    FEAT_ERC20_TRANSFER_ALL,
    FEAT_SETTLER_ERC721_TRANSFER_EVENT,
    FEAT_SETTLER_RFQ_ORDER_EVENT,
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
    LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
    LOG_TRANSFER_EVENT_TOPIC_0,
    META_TRANSACTION_EXECUTED_EVENT_TOPIC,
    ONCHAIN_GOVERNANCE_CALL_SCHEDULED_EVENT_TOPIC,
    ONCHAIN_GOVERNANCE_PROPOSAL_CREATED_EVENT_TOPIC,
    OTC_ORDER_FILLED_EVENT_TOPIC,
    POLYGON_MATIC_ADDRESS,
    PROTOCOL_ZEROEX_TIMELOCK_CONTRACT_ADDRESS,
    RFQ_ORDER_FILLED_EVENT_TOPIC,
    SOCKET_BRIDGE_EVENT_TOPIC,
    TRANSFER_EVENT_TOPIC_0,
    TRANSFORMEDERC20_EVENT_TOPIC,
    TREASURY_ZEROEX_TIMELOCK_CONTRACT_ADDRESS,
    UNISWAP_V2_PAIR_CREATED_TOPIC,
    UNISWAP_V2_SWAP_EVENT_TOPIC_0,
    UNISWAP_V2_SYNC_TOPIC,
    UNISWAP_V3_POOL_CREATED_TOPIC_0,
    UNISWAP_V3_SWAP_EVENT_TOPIC_0,
    UNWRAP_NATIVE_EVENT_TOPIC,
    V3_EXCHANGE_ADDRESS,
    V3_DEPLOYMENT_BLOCK,
    V3_FILL_EVENT_TOPIC,
    V3_CANCEL_EVENT_TOPIC,
    V3_CANCEL_UP_TO_EVENT_TOPIC,
    V4_CANCEL_EVENT_TOPIC,
    WRAP_NATIVE_EVENT_TOPIC,
    ZEROEX_PROTOCOL_GOVERNOR_CONTRACT_ADDRESS,
    ZEROEX_TREASURY_GOVERNOR_CONTRACT_ADDRESS,
    STAKING_CONTRACT,
    STAKING_TRANSACTION_EXECUTION_TOPIC,
    STAKING_STAKE_EVENT_TOPIC,
    STAKING_UNSTAKE_EVENT_TOPIC,
    STAKING_MOVE_STAKE_TOPIC,
    STAKING_STAKING_POOL_CREATED_TOPIC,
    STAKING_STAKING_POOL_EARNED_REWARDS_IN_EPOCH_TOPIC,
    STAKING_MAKER_STAKING_POOL_SET_TOPIC,
    STAKING_PARAMS_SET_TOPIC,
    STAKING_OPERATOR_SHARE_DECREASED_TOPIC,
    STAKING_EPOCH_ENDED_TOPIC,
    STAKING_EPOCH_FINALIZED_TOPIC,
    STAKING_REWARDS_PAID_TOPIC,
    SETTLER_DEPLOYER_PROXY_CONTRACT,
} from './constants';
import { Web3Source } from './data_sources/events/web3';
import {
    ERC20BridgeTransferEvent,
    Erc1155OrderCancelledEvent,
    Erc1155OrderFilledEvent,
    Erc1155OrderPresignedEvent,
    Erc721OrderCancelledEvent,
    Erc721OrderFilledEvent,
    Erc721OrderPresignedEvent,
    Event,
    ExpiredRfqOrderEvent,
    FillEvent,
    LogTransferEvent,
    CancelEvent,
    CancelUpToEvent,
    MetaTransactionExecutedEvent,
    NativeFill,
    OnchainGovernanceCallScheduledEvent,
    OnchainGovernanceProposalCreatedEvent,
    OtcOrderFilledEvent,
    SocketBridgeEvent,
    Transaction,
    TransformedERC20Event,
    UniswapV2PairCreatedEvent,
    UniswapV2SyncEvent,
    UniswapV3PoolCreatedEvent,
    UniswapV3SwapEvent,
    UnwrapNativeEvent,
    V4CancelEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
    WrapNativeEvent,
    EpochEndedEvent,
    EpochFinalizedEvent,
    MakerStakingPoolSetEvent,
    MoveStakeEvent,
    OperatorShareDecreasedEvent,
    ParamsSetEvent,
    RewardsPaidEvent,
    StakeEvent,
    StakingPoolCreatedEvent,
    StakingPoolEarnedRewardsInEpochEvent,
    TransactionExecutionEvent,
    UnstakeEvent,
    ERC20TransferEvent,
    SettlerERC721TransferEvent,
    RFQOrderEvent,
} from './entities';
import {
    filterSocketBridgeEventsGetContext,
    filterNulls,
    filterSocketBridgeEvents,
    filterWrapUnwrapEvents,
    filterWrapUnwrapEventsGetContext,
} from './filters';
import {
    parseBridgeFill,
    parseErc1155OrderCancelledEvent,
    parseErc1155OrderFilledEvent,
    parseErc1155OrderPresignedEvent,
    parseErc721OrderCancelledEvent,
    parseErc721OrderFilledEvent,
    parseErc721OrderPresignedEvent,
    parseExpiredRfqOrderEvent,
    parseFillEvent,
    parseCancelEvent,
    parseCancelUpToEvent,
    parseLiquidityProviderSwapEvent,
    parseLogTransferEvent,
    parseMetaTransactionExecutedEvent,
    parseNativeFillFromFillEvent,
    parseNativeFillFromV4LimitOrderFilledEvent,
    parseNativeFillFromV4OtcOrderFilledEvent,
    parseNativeFillFromV4RfqOrderFilledEvent,
    parseOnchainGovernanceCallScheduledEvent,
    parseOnchainGovernanceProposalCreatedEvent,
    parseOtcOrderFilledEvent,
    parseSocketBridgeEvent,
    parseTransformedERC20Event,
    parseUniswapV2PairCreatedEvent,
    parseUniswapV2SwapEvent,
    parseUniswapV2SyncEvent,
    parseUniswapV3PoolCreatedEvent,
    parseUniswapV3SwapEvent,
    parseUniswapV3VIPSwapEvent,
    parseUnwrapNativeEvent,
    parseUnwrapNativeTransferEvent,
    parseV4CancelEvent,
    parseV4LimitOrderFilledEvent,
    parseV4RfqOrderFilledEvent,
    parseWrapNativeEvent,
    parseWrapNativeTransferEvent,
    parseERC20TransferEvent,
    parseSettlerERC721TransferEvent,
    parseRFQOrderEvent,
} from './parsers';
import {
    parseEpochEndedEvent,
    parseEpochFinalizedEvent,
    parseMakerStakingPoolSetEvent,
    parseMoveStakeEvent,
    parseOperatorShareDecreasedEvent,
    parseParamsSetEvent,
    parseRewardsPaidEvent,
    parseStakeEvent,
    parseStakingPoolCreatedEvent,
    parseStakingPoolEarnedRewardsInEpochEvent,
    parseUnstakeEvent,
} from './parsers/events/staking_events';
import { parseTransactionExecutionEvent } from './parsers/events/transaction_execution_events';
import { TokenMetadataMap } from './scripts/utils/web3_utils';
import { UniV2PoolSingleton } from './uniV2PoolSingleton';
import { UniV3PoolSingleton } from './uniV3PoolSingleton';
import { DeleteOptions } from './utils';
import { LogEntry } from 'ethereum-types';
import { Producer } from 'kafkajs';
import { Connection } from 'typeorm';

function uniV2PoolSingletonCallback(pools: UniswapV2PairCreatedEvent[]) {
    const uniV2PoolSingleton = UniV2PoolSingleton.getInstance();
    uniV2PoolSingleton.addNewPools(pools);
    return pools;
}

function uniV3PoolSingletonCallback(pools: UniswapV3PoolCreatedEvent[]) {
    const uniV3PoolSingleton = UniV3PoolSingleton.getInstance();
    uniV3PoolSingleton.addNewPools(pools);
    return pools;
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
    contractAddress: string | null;
    startBlock: number;
    parser: (log: LogEntry) => any;
    deleteOptions?: DeleteOptions;
    tokenMetadataMap?: TokenMetadataMap;
    postProcess?: any;
    filterFunction?: (events: Event[], transaction: Transaction) => Event[];
    filterFunctionGetContext?: (events: Event[], web3Source: Web3Source) => Promise<Event[]>;
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
    },
    {
        enabled: FEAT_UNISWAP_V3_VIP_SWAP_EVENT,
        name: 'UniswapV3VIPEvent',
        tType: ERC20BridgeTransferEvent,
        table: 'erc20_bridge_transfer_events',
        topics: [UNISWAP_V3_SWAP_EVENT_TOPIC_0, addressToTopic(EP_ADDRESS)],
        contractAddress: null,
        startBlock: UNISWAP_V3_VIP_SWAP_START_BLOCK,
        parser: parseUniswapV3VIPSwapEvent,
        filterFunction: filterNulls,
        deleteOptions: { directFlag: true, directProtocol: ['UniswapV3'] },
        tokenMetadataMap: { tokenA: 'fromToken', tokenB: 'toToken' },
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
        deleteOptions: { directFlag: false },
        tokenMetadataMap: { tokenA: 'fromToken', tokenB: 'toToken' },
    },
    {
        enabled: FEAT_UNISWAP_V2_VIP_SWAP_EVENT,
        name: 'VIPSwapEvent',
        tType: ERC20BridgeTransferEvent,
        table: 'erc20_bridge_transfer_events',
        topics: [UNISWAP_V2_SWAP_EVENT_TOPIC_0, addressToTopic(EP_ADDRESS)],
        contractAddress: null,
        startBlock: UNISWAP_V2_VIP_SWAP_START_BLOCK,
        parser: parseUniswapV2SwapEvent,
        filterFunction: filterNulls,
        deleteOptions: { directFlag: true, directProtocol: UNISWAP_V2_VIP_SWAP_SOURCES },
        tokenMetadataMap: { tokenA: 'fromToken', tokenB: 'toToken' },
    },
    {
        enabled: FEAT_PLP_SWAP_EVENT,
        name: 'LiquidityProviderSwapEvent',
        tType: ERC20BridgeTransferEvent,
        table: 'erc20_bridge_transfer_events',
        topics: LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
        contractAddress: EP_ADDRESS,
        startBlock: PLP_VIP_START_BLOCK,
        parser: parseLiquidityProviderSwapEvent,
        deleteOptions: { directFlag: true, directProtocol: ['PLP'] },
        tokenMetadataMap: { tokenA: 'fromToken', tokenB: 'toToken' },
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
        tokenMetadataMap: { tokenA: 'makerToken', tokenB: 'takerToken' },
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
        tokenMetadataMap: { tokenA: 'makerToken', tokenB: 'takerToken' },
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
        tokenMetadataMap: { tokenA: 'makerTokenAddress', tokenB: 'takerTokenAddress' },
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
        tokenMetadataMap: { tokenA: 'makerTokenAddress', tokenB: 'takerTokenAddress' },
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
        tokenMetadataMap: { tokenA: 'erc20Token', tokenB: 'erc721Token' },
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
        tokenMetadataMap: { tokenA: 'erc20Token', tokenB: 'erc721Token' },
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
        tokenMetadataMap: { tokenA: 'erc20Token', tokenB: 'erc1155Token' },
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
        tokenMetadataMap: { tokenA: 'erc20Token', tokenB: 'erc1155Token' },
    },
    {
        enabled: FEAT_UNISWAP_V2_SYNC_EVENT,
        name: 'UniswapV2SyncEvent',
        tType: UniswapV2SyncEvent,
        table: 'uniswap_v2_sync_events',
        topics: UNISWAP_V2_SYNC_TOPIC,
        contractAddress: null,
        startBlock: UNISWAP_V2_SYNC_START_BLOCK,
        parser: parseUniswapV2SyncEvent,
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
    },
    {
        enabled: FEAT_UNISWAP_V3_SWAP_EVENT,
        name: 'UniswapV3SwapEvent',
        tType: UniswapV3SwapEvent,
        table: 'uniswap_v3_swap_events',
        topics: [UNISWAP_V3_SWAP_EVENT_TOPIC_0],
        contractAddress: null,
        startBlock: UNISWAP_V3_SWAP_START_BLOCK,
        parser: parseUniswapV3SwapEvent,
    },
    {
        enabled: FEAT_UNISWAP_V3_POOL_CREATED_EVENT,
        name: 'UniswapV3PoolCreatedEvent',
        tType: UniswapV3PoolCreatedEvent,
        table: 'uniswap_v3_pool_created_events',
        topics: [UNISWAP_V3_POOL_CREATED_TOPIC_0],
        contractAddress: UNISWAP_V3_FACTORY_ADDRESS,
        startBlock: UNISWAP_V3_POOL_CREATED_START_BLOCK,
        parser: parseUniswapV3PoolCreatedEvent,
        postProcess: uniV3PoolSingletonCallback,
    },
    {
        enabled: FEAT_ONCHAIN_GOVERNANCE,
        name: 'ZeroexTreasuryGovernorProposalCreatedEvent',
        tType: OnchainGovernanceProposalCreatedEvent,
        table: 'onchain_governance_proposal_created',
        topics: ONCHAIN_GOVERNANCE_PROPOSAL_CREATED_EVENT_TOPIC,
        contractAddress: ZEROEX_TREASURY_GOVERNOR_CONTRACT_ADDRESS,
        startBlock: ONCHAIN_GOVERNANCE_START_BLOCK,
        parser: (log: LogEntry) => parseOnchainGovernanceProposalCreatedEvent(log, 'ZeroexTreasuryGovernor'),
    },
    {
        enabled: FEAT_ONCHAIN_GOVERNANCE,
        name: 'ZeroExProtocolGovernorProposalCreatedEvent',
        tType: OnchainGovernanceProposalCreatedEvent,
        table: 'onchain_governance_proposal_created',
        topics: ONCHAIN_GOVERNANCE_PROPOSAL_CREATED_EVENT_TOPIC,
        contractAddress: ZEROEX_PROTOCOL_GOVERNOR_CONTRACT_ADDRESS,
        startBlock: ONCHAIN_GOVERNANCE_START_BLOCK,
        parser: (log: LogEntry) => parseOnchainGovernanceProposalCreatedEvent(log, 'ZeroexProtocolGovernor'),
    },
    {
        enabled: FEAT_ONCHAIN_GOVERNANCE,
        name: 'TreasuryZeroexTimelockCallScheduledEvent',
        tType: OnchainGovernanceCallScheduledEvent,
        table: 'onchain_governance_call_scheduled',
        topics: ONCHAIN_GOVERNANCE_CALL_SCHEDULED_EVENT_TOPIC,
        contractAddress: TREASURY_ZEROEX_TIMELOCK_CONTRACT_ADDRESS,
        startBlock: ONCHAIN_GOVERNANCE_START_BLOCK,
        parser: (log: LogEntry) => parseOnchainGovernanceCallScheduledEvent(log, 'TreasuryZeroexTimelock'),
    },
    {
        enabled: FEAT_ONCHAIN_GOVERNANCE,
        name: 'ProtocolZeroexTimelockCallScheduledEvent',
        tType: OnchainGovernanceCallScheduledEvent,
        table: 'onchain_governance_call_scheduled',
        topics: ONCHAIN_GOVERNANCE_CALL_SCHEDULED_EVENT_TOPIC,
        contractAddress: PROTOCOL_ZEROEX_TIMELOCK_CONTRACT_ADDRESS,
        startBlock: ONCHAIN_GOVERNANCE_START_BLOCK,
        parser: (log: LogEntry) => parseOnchainGovernanceCallScheduledEvent(log, 'ProtocolZeroexTimelock'),
    },
    {
        enabled: FEAT_WRAP_UNWRAP_NATIVE_EVENT,
        name: 'WrapNativeEvent',
        tType: WrapNativeEvent,
        table: 'wrap_native_events',
        topics: WRAP_NATIVE_EVENT_TOPIC,
        contractAddress: WRAP_UNWRAP_NATIVE_CONTRACT_ADDRESS,
        startBlock: WRAP_UNWRAP_NATIVE_START_BLOCK,
        parser: parseWrapNativeEvent,
        filterFunction: filterWrapUnwrapEvents,
        filterFunctionGetContext: filterWrapUnwrapEventsGetContext,
    },
    {
        enabled: FEAT_WRAP_UNWRAP_NATIVE_EVENT,
        name: 'UnwrapNativeEvent',
        tType: UnwrapNativeEvent,
        table: 'unwrap_native_events',
        topics: UNWRAP_NATIVE_EVENT_TOPIC,
        contractAddress: WRAP_UNWRAP_NATIVE_CONTRACT_ADDRESS,
        startBlock: WRAP_UNWRAP_NATIVE_START_BLOCK,
        parser: parseUnwrapNativeEvent,
        filterFunction: filterWrapUnwrapEvents,
        filterFunctionGetContext: filterWrapUnwrapEventsGetContext,
    },
    {
        enabled: FEAT_WRAP_UNWRAP_NATIVE_TRANSFER_EVENT,
        name: 'WrapNativeTransferEvent',
        tType: WrapNativeEvent,
        table: 'wrap_native_events',
        topics: [TRANSFER_EVENT_TOPIC_0, '0x0000000000000000000000000000000000000000000000000000000000000000', null],
        contractAddress: WRAP_UNWRAP_NATIVE_CONTRACT_ADDRESS,
        startBlock: WRAP_UNWRAP_NATIVE_START_BLOCK,
        parser: parseWrapNativeTransferEvent,
        filterFunction: filterWrapUnwrapEvents,
        filterFunctionGetContext: filterWrapUnwrapEventsGetContext,
    },
    {
        enabled: FEAT_WRAP_UNWRAP_NATIVE_TRANSFER_EVENT,
        name: 'UnwrapNativeTransferEvent',
        tType: UnwrapNativeEvent,
        table: 'unwrap_native_events',
        topics: [TRANSFER_EVENT_TOPIC_0, null, '0x0000000000000000000000000000000000000000000000000000000000000000'],
        contractAddress: WRAP_UNWRAP_NATIVE_CONTRACT_ADDRESS,
        startBlock: WRAP_UNWRAP_NATIVE_START_BLOCK,
        parser: parseUnwrapNativeTransferEvent,
        filterFunction: filterWrapUnwrapEvents,
        filterFunctionGetContext: filterWrapUnwrapEventsGetContext,
    },
    {
        enabled: FEAT_SOCKET_BRIDGE_EVENT,
        name: 'SocketBridgeEvent',
        tType: SocketBridgeEvent,
        table: 'socket_bridge_events',
        topics: SOCKET_BRIDGE_EVENT_TOPIC,
        contractAddress: SOCKET_BRIDGE_CONTRACT_ADDRESS,
        startBlock: SOCKET_BRIDGE_EVENT_START_BLOCK,
        parser: parseSocketBridgeEvent,
        filterFunctionGetContext: filterSocketBridgeEventsGetContext,
        filterFunction: filterSocketBridgeEvents,
    },

    {
        enabled: FEAT_V3_CANCEL_EVENTS,
        name: 'CancelEvent',
        tType: CancelEvent,
        table: 'cancel_events',
        topics: V3_CANCEL_EVENT_TOPIC,
        contractAddress: V3_EXCHANGE_ADDRESS,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseCancelEvent,
    },
    {
        enabled: FEAT_V3_CANCEL_EVENTS,
        name: 'CancelUpToEvent',
        tType: CancelUpToEvent,
        table: 'cancel_up_to_events',
        topics: V3_CANCEL_UP_TO_EVENT_TOPIC,
        contractAddress: V3_EXCHANGE_ADDRESS,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseCancelUpToEvent,
    },

    {
        enabled: FEAT_STAKING,
        name: 'TransactionExecutionEvent',
        tType: TransactionExecutionEvent,
        table: 'transaction_execution_events',
        topics: STAKING_TRANSACTION_EXECUTION_TOPIC,
        contractAddress: V3_EXCHANGE_ADDRESS,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseTransactionExecutionEvent,
    },
    {
        enabled: FEAT_STAKING,
        name: 'StakeEvent',
        tType: StakeEvent,
        table: 'stake_events',
        topics: STAKING_STAKE_EVENT_TOPIC,
        contractAddress: STAKING_CONTRACT,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseStakeEvent,
    },
    {
        enabled: FEAT_STAKING,
        name: 'UnstakeEvent',
        tType: UnstakeEvent,
        table: 'unstake_events',
        topics: STAKING_UNSTAKE_EVENT_TOPIC,
        contractAddress: STAKING_CONTRACT,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseUnstakeEvent,
    },
    {
        enabled: FEAT_STAKING,
        name: 'MoveStakeEvent',
        tType: MoveStakeEvent,
        table: 'move_stake_events',
        topics: STAKING_MOVE_STAKE_TOPIC,
        contractAddress: STAKING_CONTRACT,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseMoveStakeEvent,
    },
    {
        enabled: FEAT_STAKING,
        name: 'StakingPoolCreatedEvent',
        tType: StakingPoolCreatedEvent,
        table: 'staking_pool_created_events',
        topics: STAKING_STAKING_POOL_CREATED_TOPIC,
        contractAddress: STAKING_CONTRACT,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseStakingPoolCreatedEvent,
    },
    {
        enabled: FEAT_STAKING,
        name: 'StakingPoolEarnedRewardsInEpochEvent',
        tType: StakingPoolEarnedRewardsInEpochEvent,
        table: 'staking_pool_earned_rewards_in_epoch_events',
        topics: STAKING_STAKING_POOL_EARNED_REWARDS_IN_EPOCH_TOPIC,
        contractAddress: STAKING_CONTRACT,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseStakingPoolEarnedRewardsInEpochEvent,
    },
    {
        enabled: FEAT_STAKING,
        name: 'MakerStakingPoolSetEvent',
        tType: MakerStakingPoolSetEvent,
        table: 'maker_staking_pool_set_events',
        topics: STAKING_MAKER_STAKING_POOL_SET_TOPIC,
        contractAddress: STAKING_CONTRACT,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseMakerStakingPoolSetEvent,
    },
    {
        enabled: FEAT_STAKING,
        name: 'ParamsSetEvent',
        tType: ParamsSetEvent,
        table: 'params_set_events',
        topics: STAKING_PARAMS_SET_TOPIC,
        contractAddress: STAKING_CONTRACT,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseParamsSetEvent,
    },
    {
        enabled: FEAT_STAKING,
        name: 'OperatorShareDecreasedEvent',
        tType: OperatorShareDecreasedEvent,
        table: 'operator_share_decreased_events',
        topics: STAKING_OPERATOR_SHARE_DECREASED_TOPIC,
        contractAddress: STAKING_CONTRACT,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseOperatorShareDecreasedEvent,
    },
    {
        enabled: FEAT_STAKING,
        name: 'EpochEndedEvent',
        tType: EpochEndedEvent,
        table: 'epoch_ended_events',
        topics: STAKING_EPOCH_ENDED_TOPIC,
        contractAddress: STAKING_CONTRACT,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseEpochEndedEvent,
    },
    {
        enabled: FEAT_STAKING,
        name: 'EpochFinalizedEvent',
        tType: EpochFinalizedEvent,
        table: 'epoch_finalized_events',
        topics: STAKING_EPOCH_FINALIZED_TOPIC,
        contractAddress: STAKING_CONTRACT,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseEpochFinalizedEvent,
    },
    {
        enabled: FEAT_STAKING,
        name: 'RewardsPaidEvent',
        tType: RewardsPaidEvent,
        table: 'rewards_paid_events',
        topics: STAKING_REWARDS_PAID_TOPIC,
        contractAddress: STAKING_CONTRACT,
        startBlock: V3_DEPLOYMENT_BLOCK,
        parser: parseRewardsPaidEvent,
    },
    {
        enabled: FEAT_ERC20_TRANSFER_ALL,
        name: 'ERC20TransferEvent',
        tType: ERC20TransferEvent,
        table: 'erc20_transfer_events',
        topics: [TRANSFER_EVENT_TOPIC_0],
        contractAddress: null,
        startBlock: SETTLER_DEPLOYMENT_BLOCK,
        parser: parseERC20TransferEvent,
        filterFunction: filterNulls,
    },
    {
        enabled: FEAT_SETTLER_ERC721_TRANSFER_EVENT,
        name: 'SettlerERC721TransferEvent',
        tType: SettlerERC721TransferEvent,
        table: 'settler_erc721_transfer_events',
        topics: [TRANSFER_EVENT_TOPIC_0],
        contractAddress: SETTLER_DEPLOYER_PROXY_CONTRACT,
        startBlock: SETTLER_DEPLOYMENT_BLOCK,
        parser: parseSettlerERC721TransferEvent,
        filterFunction: filterNulls,
    },
    {
        enabled: FEAT_SETTLER_RFQ_ORDER_EVENT,
        name: 'RFQOrderEvent',
        tType: RFQOrderEvent,
        table: 'rfq_order_events',
        topics: [],
        contractAddress: null,
        startBlock: SETTLER_DEPLOYMENT_BLOCK,
        parser: parseRFQOrderEvent,
        filterFunction: filterNulls,
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
        parser: (log: LogEntry) => parseUniswapV2PairCreatedEvent(log, protocol.name),
        deleteOptions: { protocol: protocol.name },
        tokenMetadataMap: { tokenA: 'token0', tokenB: 'token1' },
        postProcess: uniV2PoolSingletonCallback,
    });
}

export function addressToTopic(address: string): string {
    if (address.length === 42 && address.substring(0, 2) === '0x') {
        return `0x000000000000000000000000${address.substring(2)}`;
    }
    throw new Error(`Error while converting convert ${address} to topic`);
}
