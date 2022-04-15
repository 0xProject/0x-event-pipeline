import { web3Factory } from '@0x/dev-utils';
import { logger } from '../utils/logger';
import { Connection } from 'typeorm';
import { Web3Source } from '../data_sources/events/web3';
import { calculateEndBlockAsync } from './utils/shared_utils';

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
    NativeFill,
    OneinchSwappedV3Event,
    OneinchSwappedV4Event,
    OpenOceanSwappedV1Event,
    OtcOrderFilledEvent,
    ParaswapSwapped2V5Event,
    ParaswapSwappedV4Event,
    ParaswapSwappedV5Event,
    SlingshotTradeEvent,
    TimechainSwapV1Event,
    TransformedERC20Event,
    V4CancelEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
} from '../entities';

import {
    EP_ADDRESS,
    EP_DEPLOYMENT_BLOCK,
    ETHEREUM_RPC_URL,
    FEAT_ERC20_BRIDGE_TRANSFER_FLASHWALLET,
    FEAT_LIMIT_ORDERS,
    FEAT_NFT,
    FEAT_ONEINCH_SWAPPED_V3_EVENT,
    FEAT_ONEINCH_SWAPPED_V4_EVENT,
    FEAT_OPEN_OCEAN_SWAPPED_V1_EVENT,
    FEAT_OTC_ORDERS,
    FEAT_PARASWAP_SWAPPED2_V5_EVENT,
    FEAT_PARASWAP_SWAPPED_V4_EVENT,
    FEAT_PARASWAP_SWAPPED_V5_EVENT,
    FEAT_PLP_SWAP_EVENT,
    FEAT_RFQ_EVENT,
    FEAT_SLINGSHOT_TRADE_EVENT,
    FEAT_TIMECHAIN_SWAP_V1_EVENT,
    FEAT_TRANSFORMED_ERC20_EVENT,
    FEAT_UNISWAP_V2_VIP_SWAP_EVENT,
    FEAT_UNISWAP_V3_VIP_SWAP_EVENT,
    FEAT_V3_FILL_EVENT,
    FEAT_V3_NATIVE_FILL,
    FIRST_SEARCH_BLOCK,
    FLASHWALLET_ADDRESS,
    FLASHWALLET_DEPLOYMENT_BLOCK,
    NFT_FEATURE_START_BLOCK,
    ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK,
    ONEINCH_ROUTER_V4_DEPLOYMENT_BLOCK,
    OPEN_OCEAN_V1_DEPLOYMENT_BLOCK,
    OTC_ORDERS_FEATURE_START_BLOCK,
    PARASWAP_V4_CONTRACT_ADDRESS,
    PARASWAP_V4_DEPLOYMENT_BLOCK,
    PARASWAP_V5_5_DEPLOYMENT_BLOCK,
    PARASWAP_V5_CONTRACT_ADDRESS,
    PARASWAP_V5_DEPLOYMENT_BLOCK,
    PLP_VIP_START_BLOCK,
    SLINGSHOT_DEPLOYMENT_BLOCK,
    TIMECHAIN_V1_DEPLOYMENT_BLOCK,
    UNISWAP_V2_VIP_SWAP_SOURCES,
    UNISWAP_V2_VIP_SWAP_START_BLOCK,
    UNISWAP_V3_VIP_SWAP_START_BLOCK,
    V4_NATIVE_FILL_START_BLOCK,
} from '../config';
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
    ONEINCH_ROUTER_V3_CONTRACT_ADDRESS,
    ONEINCH_ROUTER_V4_CONTRACT_ADDRESS,
    ONEINCH_SWAPPED_EVENT_TOPIC,
    OPEN_OCEAN_SWAPPED_V1_EVENT_TOPIC,
    OPEN_OCEAN_V1_CONTRACT_ADDRESS,
    OTC_ORDER_FILLED_EVENT_TOPIC,
    PARASWAP_SWAPPED2_V5_EVENT_TOPIC,
    PARASWAP_SWAPPED_V4_EVENT_TOPIC,
    PARASWAP_SWAPPED_V5_EVENT_TOPIC,
    RFQORDERFILLED_EVENT_TOPIC,
    SLINGSHOT_CONTRACT_ADDRESS,
    SLINGSHOT_TRADE_EVENT_TOPIC,
    SWAP_EVENT_TOPIC,
    SWAP_V3_EVENT_TOPIC,
    TIMECHAIN_SWAP_V1_EVENT_TOPIC,
    TIMECHAIN_V1_CONTRACT_ADDRESS,
    TRANSFORMEDERC20_EVENT_TOPIC,
    V3_EXCHANGE_ADDRESS,
    V3_FILL_EVENT_TOPIC,
    V4_CANCEL_EVENT_TOPIC,
} from '../constants';

import { parseTransformedERC20Event } from '../parsers/events/transformed_erc20_events';
import { parseOneinchSwappedEvent } from '../parsers/events/oneinch_swapped_event';
import { parseOpenOceanSwappedV1Event } from '../parsers/events/open_ocean_swapped_event';
import {
    parseParaswapSwapped2V5Event,
    parseParaswapSwappedV4Event,
    parseParaswapSwappedV5Event,
} from '../parsers/events/paraswap_swapped_event';
import { parseSlingshotTradeEvent } from '../parsers/events/slingshot_trade_event';
import { parseLiquidityProviderSwapEvent } from '../parsers/events/liquidity_provider_swap_events';
import {
    parseNativeFillFromV4RfqOrderFilledEvent,
    parseV4RfqOrderFilledEvent,
} from '../parsers/events/v4_rfq_order_filled_events';
import { parseTimechainSwapV1Event } from '../parsers/events/timechain_swap_event';
import { parseUniswapV3SwapEvent } from '../parsers/events/swap_events';
import {
    parseNativeFillFromV4LimitOrderFilledEvent,
    parseV4LimitOrderFilledEvent,
} from '../parsers/events/v4_limit_order_filled_events';
import { parseFillEvent } from '../parsers/events/fill_events';
import { parseNativeFillFromFillEvent } from '../parsers/events/fill_events';
import { parseV4CancelEvent } from '../parsers/events/v4_cancel_events';
import { parseExpiredRfqOrderEvent } from '../parsers/events/expired_rfq_order_events';
import {
    parseNativeFillFromV4OtcOrderFilledEvent,
    parseOtcOrderFilledEvent,
} from '../parsers/events/otc_order_filled_events';
import { parseUniswapV2SwapEvent } from '../parsers/events/swap_events';
import {
    parseErc1155OrderCancelledEvent,
    parseErc1155OrderFilledEvent,
    parseErc1155OrderPresignedEvent,
    parseErc721OrderCancelledEvent,
    parseErc721OrderFilledEvent,
    parseErc721OrderPresignedEvent,
} from '../parsers/events/nft_events';

import { parseBridgeFill } from '../parsers/events/bridge_transfer_events';

import { PullAndSaveEventsByTopic } from './utils/event_abi_utils';
import { SCRIPT_RUN_DURATION } from '../utils/metrics';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});
const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);

const pullAndSaveEventsByTopic = new PullAndSaveEventsByTopic();

export class EventsByTopicScraper {
    public async getParseSaveEventsAsync(connection: Connection): Promise<void> {
        const startTime = new Date().getTime();
        logger.info(`pulling events`);
        const latestBlockWithOffset = await calculateEndBlockAsync(web3Source);

        logger.child({ latestBlockWithOffset }).info(`latest block with offset: ${latestBlockWithOffset}`);

        const promises: Promise<void>[] = [];

        if (FEAT_TRANSFORMED_ERC20_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<TransformedERC20Event>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'TransformedERC20Event',
                    TransformedERC20Event,
                    'transformed_erc20_events',
                    TRANSFORMEDERC20_EVENT_TOPIC,
                    EP_ADDRESS,
                    EP_DEPLOYMENT_BLOCK,
                    parseTransformedERC20Event,
                    {},
                ),
            );
        }

        if (FEAT_ONEINCH_SWAPPED_V3_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<OneinchSwappedV3Event>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'OneinchSwappedV3Event',
                    OneinchSwappedV3Event,
                    'oneinch_swapped_v3_events',
                    ONEINCH_SWAPPED_EVENT_TOPIC,
                    ONEINCH_ROUTER_V3_CONTRACT_ADDRESS,
                    ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK,
                    parseOneinchSwappedEvent,
                    {},
                ),
            );
        }
        if (FEAT_ERC20_BRIDGE_TRANSFER_FLASHWALLET) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ERC20BridgeTransferEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'ERC20BridgeTransferFlashwallet',
                    ERC20BridgeTransferEvent,
                    'erc20_bridge_transfer_events',
                    BRIDGEFILL_EVENT_TOPIC,
                    FLASHWALLET_ADDRESS,
                    FLASHWALLET_DEPLOYMENT_BLOCK,
                    parseBridgeFill,
                    { isDirectTrade: false },
                    { tokenA: 'fromToken', tokenB: 'toToken' },
                ),
            );
        }
        if (FEAT_ONEINCH_SWAPPED_V4_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<OneinchSwappedV4Event>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'OneinchSwappedV4Event',
                    OneinchSwappedV4Event,
                    'oneinch_swapped_v4_events',
                    ONEINCH_SWAPPED_EVENT_TOPIC,
                    ONEINCH_ROUTER_V4_CONTRACT_ADDRESS,
                    ONEINCH_ROUTER_V4_DEPLOYMENT_BLOCK,
                    parseOneinchSwappedEvent,
                    {},
                ),
            );
        }

        if (FEAT_UNISWAP_V2_VIP_SWAP_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ERC20BridgeTransferEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'VIPSwapEvent',
                    ERC20BridgeTransferEvent,
                    'erc20_bridge_transfer_events',
                    SWAP_EVENT_TOPIC,
                    'nofilter',
                    UNISWAP_V2_VIP_SWAP_START_BLOCK,
                    parseUniswapV2SwapEvent,
                    { isDirectTrade: true, directProtocol: UNISWAP_V2_VIP_SWAP_SOURCES },
                    { tokenA: 'fromToken', tokenB: 'toToken' },
                ),
            );
        }
        if (FEAT_SLINGSHOT_TRADE_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<SlingshotTradeEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'SlingshotTradeEvent',
                    SlingshotTradeEvent,
                    'slingshot_trade_events',
                    SLINGSHOT_TRADE_EVENT_TOPIC,
                    SLINGSHOT_CONTRACT_ADDRESS,
                    SLINGSHOT_DEPLOYMENT_BLOCK,
                    parseSlingshotTradeEvent,
                    {},
                ),
            );
        }

        if (FEAT_PARASWAP_SWAPPED_V4_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ParaswapSwappedV4Event>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'ParaswapSwappedV4Event',
                    ParaswapSwappedV4Event,
                    'paraswap_swapped_v4_events',
                    PARASWAP_SWAPPED_V4_EVENT_TOPIC,
                    PARASWAP_V4_CONTRACT_ADDRESS,
                    PARASWAP_V4_DEPLOYMENT_BLOCK,
                    parseParaswapSwappedV4Event,
                    {},
                ),
            );
        }

        if (FEAT_PARASWAP_SWAPPED_V5_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ParaswapSwappedV5Event>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'ParaswapSwappedV5Event',
                    ParaswapSwappedV5Event,
                    'paraswap_swapped_v5_events',
                    PARASWAP_SWAPPED_V5_EVENT_TOPIC,
                    PARASWAP_V5_CONTRACT_ADDRESS,
                    PARASWAP_V5_DEPLOYMENT_BLOCK,
                    parseParaswapSwappedV5Event,
                    {},
                ),
            );
        }

        if (FEAT_PARASWAP_SWAPPED2_V5_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ParaswapSwapped2V5Event>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'ParaswapSwapped2V5Event',
                    ParaswapSwapped2V5Event,
                    'paraswap_swapped2_v5_events',
                    PARASWAP_SWAPPED2_V5_EVENT_TOPIC,
                    PARASWAP_V5_CONTRACT_ADDRESS,
                    PARASWAP_V5_5_DEPLOYMENT_BLOCK,
                    parseParaswapSwapped2V5Event,
                    {},
                ),
            );
        }

        if (FEAT_OPEN_OCEAN_SWAPPED_V1_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<OpenOceanSwappedV1Event>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'OpenOceanSwappedV1Event',
                    OpenOceanSwappedV1Event,
                    'open_ocean_swapped_v1_events',
                    OPEN_OCEAN_SWAPPED_V1_EVENT_TOPIC,
                    OPEN_OCEAN_V1_CONTRACT_ADDRESS,
                    OPEN_OCEAN_V1_DEPLOYMENT_BLOCK,
                    parseOpenOceanSwappedV1Event,
                    {},
                ),
            );
        }

        if (FEAT_TIMECHAIN_SWAP_V1_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<TimechainSwapV1Event>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'TimechainSwapV1Event',
                    TimechainSwapV1Event,
                    'timechain_swap_v1_events',
                    TIMECHAIN_SWAP_V1_EVENT_TOPIC,
                    TIMECHAIN_V1_CONTRACT_ADDRESS,
                    TIMECHAIN_V1_DEPLOYMENT_BLOCK,
                    parseTimechainSwapV1Event,
                    {},
                ),
            );
        }
        if (FEAT_PLP_SWAP_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ERC20BridgeTransferEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'LiquidityProviderSwapEvent',
                    ERC20BridgeTransferEvent,
                    'erc20_bridge_transfer_events',
                    LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
                    EP_ADDRESS,
                    PLP_VIP_START_BLOCK,
                    parseLiquidityProviderSwapEvent,
                    { isDirectTrade: true, directProtocol: ['PLP'] },
                    { tokenA: 'fromToken', tokenB: 'toToken' },
                ),
            );
        }

        if (FEAT_UNISWAP_V3_VIP_SWAP_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ERC20BridgeTransferEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'UniswapV3VIPEvent',
                    ERC20BridgeTransferEvent,
                    'erc20_bridge_transfer_events',
                    SWAP_V3_EVENT_TOPIC,
                    'nofilter',
                    UNISWAP_V3_VIP_SWAP_START_BLOCK,
                    parseUniswapV3SwapEvent,
                    { isDirectTrade: true, directProtocol: ['UniswapV3'] },
                    { tokenA: 'fromToken', tokenB: 'toToken' },
                ),
            );
        }

        if (FEAT_RFQ_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4RfqOrderFilledEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'V4RfqOrderFilledEvent',
                    V4RfqOrderFilledEvent,
                    'v4_rfq_order_filled_events',
                    RFQORDERFILLED_EVENT_TOPIC,
                    EP_ADDRESS,
                    V4_NATIVE_FILL_START_BLOCK,
                    parseV4RfqOrderFilledEvent,
                    {},
                    { tokenA: 'makerToken', tokenB: 'takerToken' },
                ),
            );

            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'NativeFillFromRFQV4',
                    NativeFill,
                    'native_fills',
                    RFQORDERFILLED_EVENT_TOPIC,
                    EP_ADDRESS,
                    V4_NATIVE_FILL_START_BLOCK,
                    parseNativeFillFromV4RfqOrderFilledEvent,
                    { protocolVersion: 'v4', nativeOrderType: 'RFQ Order' },
                ),
            );
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ExpiredRfqOrderEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'ExpiredRfqOrderEvent',
                    ExpiredRfqOrderEvent,
                    'expired_rfq_order_events',
                    EXPIRED_RFQ_ORDER_EVENT_TOPIC,
                    EP_ADDRESS,
                    V4_NATIVE_FILL_START_BLOCK,
                    parseExpiredRfqOrderEvent,
                    {},
                ),
            );
        }

        if (FEAT_LIMIT_ORDERS) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4LimitOrderFilledEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'V4LimitOrderFilledEvent',
                    V4LimitOrderFilledEvent,
                    'v4_limit_order_filled_events',
                    LIMITORDERFILLED_EVENT_TOPIC,
                    EP_ADDRESS,
                    V4_NATIVE_FILL_START_BLOCK,
                    parseV4LimitOrderFilledEvent,
                    {},
                    { tokenA: 'makerToken', tokenB: 'takerToken' },
                ),
            );
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'NativeFillFromLimitV4',
                    NativeFill,
                    'native_fills',
                    LIMITORDERFILLED_EVENT_TOPIC,
                    EP_ADDRESS,
                    V4_NATIVE_FILL_START_BLOCK,
                    parseNativeFillFromV4LimitOrderFilledEvent,
                    { protocolVersion: 'v4', nativeOrderType: 'Limit Order' },
                ),
            );
        }

        if (FEAT_RFQ_EVENT || FEAT_LIMIT_ORDERS) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4CancelEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'V4CancelEvent',
                    V4CancelEvent,
                    'v4_cancel_events',
                    V4_CANCEL_EVENT_TOPIC,
                    EP_ADDRESS,
                    V4_NATIVE_FILL_START_BLOCK,
                    parseV4CancelEvent,
                    {},
                ),
            );
        }

        if (FEAT_OTC_ORDERS) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<OtcOrderFilledEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'OtcOrderFilledEvent',
                    OtcOrderFilledEvent,
                    'otc_order_filled_events',
                    OTC_ORDER_FILLED_EVENT_TOPIC,
                    EP_ADDRESS,
                    OTC_ORDERS_FEATURE_START_BLOCK,
                    parseOtcOrderFilledEvent,
                    {},
                    { tokenA: 'makerTokenAddress', tokenB: 'takerTokenAddress' },
                ),
            );
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'NativeFillFromOTC',
                    NativeFill,
                    'native_fills',
                    OTC_ORDER_FILLED_EVENT_TOPIC,
                    EP_ADDRESS,
                    OTC_ORDERS_FEATURE_START_BLOCK,
                    parseNativeFillFromV4OtcOrderFilledEvent,
                    { protocolVersion: 'v4', nativeOrderType: 'OTC Order' },
                ),
            );
        }

        if (FEAT_V3_FILL_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<FillEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'FillEvent',
                    FillEvent,
                    'fill_events',
                    V3_FILL_EVENT_TOPIC,
                    V3_EXCHANGE_ADDRESS,
                    FIRST_SEARCH_BLOCK,
                    parseFillEvent,
                    {},
                    { tokenA: 'makerTokenAddress', tokenB: 'takerTokenAddress' },
                ),
            );
        }

        if (FEAT_V3_NATIVE_FILL) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'NativeFillFromV3',
                    NativeFill,
                    'native_fills',
                    V3_FILL_EVENT_TOPIC,
                    V3_EXCHANGE_ADDRESS,
                    FIRST_SEARCH_BLOCK,
                    parseNativeFillFromFillEvent,
                    { protocolVersion: 'v3' },
                ),
            );
        }

        if (FEAT_NFT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<Erc721OrderFilledEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'Erc721OrderFilledEvent',
                    Erc721OrderFilledEvent,
                    'erc721_order_filled_events',
                    ERC721_ORDER_FILLED_EVENT_TOPIC,
                    EP_ADDRESS,
                    NFT_FEATURE_START_BLOCK,
                    parseErc721OrderFilledEvent,
                    {},
                    { tokenA: 'erc20Token', tokenB: 'erc721Token' },
                ),
            );
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<Erc721OrderCancelledEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'Erc721OrderCancelledEvent',
                    Erc721OrderCancelledEvent,
                    'erc721_order_cancelled_events',
                    ERC721_ORDER_CANCELLED_EVENT_TOPIC,
                    EP_ADDRESS,
                    NFT_FEATURE_START_BLOCK,
                    parseErc721OrderCancelledEvent,
                    {},
                ),
            );
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<Erc721OrderPresignedEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'Erc721OrderPresignedEvent',
                    Erc721OrderPresignedEvent,
                    'erc721_order_presigned_events',
                    ERC721_ORDER_PRESIGNED_EVENT_TOPIC,
                    EP_ADDRESS,
                    NFT_FEATURE_START_BLOCK,
                    parseErc721OrderPresignedEvent,
                    {},
                    { tokenA: 'erc20Token', tokenB: 'erc721Token' },
                ),
            );
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<Erc1155OrderFilledEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'Erc1155OrderFilledEvent',
                    Erc1155OrderFilledEvent,
                    'erc1155_order_filled_events',
                    ERC1155_ORDER_FILLED_EVENT_TOPIC,
                    EP_ADDRESS,
                    NFT_FEATURE_START_BLOCK,
                    parseErc1155OrderFilledEvent,
                    {},
                    { tokenA: 'erc20Token', tokenB: 'erc1155Token' },
                ),
            );
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<Erc1155OrderCancelledEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'Erc1155OrderCancelledEvent',
                    Erc1155OrderCancelledEvent,
                    'erc1155_order_cancelled_events',
                    ERC1155_ORDER_CANCELLED_EVENT_TOPIC,
                    EP_ADDRESS,
                    NFT_FEATURE_START_BLOCK,
                    parseErc1155OrderCancelledEvent,
                    {},
                ),
            );
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<Erc1155OrderPresignedEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'Erc1155OrderPresignedEvent',
                    Erc1155OrderPresignedEvent,
                    'erc1155_order_presigned_events',
                    ERC1155_ORDER_PRESIGNED_EVENT_TOPIC,
                    EP_ADDRESS,
                    NFT_FEATURE_START_BLOCK,
                    parseErc1155OrderPresignedEvent,
                    {},
                    { tokenA: 'erc20Token', tokenB: 'erc1155Token' },
                ),
            );
        }

        await Promise.all(promises);

        const endTime = new Date().getTime();
        const scriptDurationSeconds = (endTime - startTime) / 1000;
        SCRIPT_RUN_DURATION.set({ script: 'events-by-topic' }, scriptDurationSeconds);

        logger.info(`Finished pulling events by topic in ${scriptDurationSeconds}`);
    }
}
