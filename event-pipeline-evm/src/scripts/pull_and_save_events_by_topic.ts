import { web3Factory } from '@0x/dev-utils';
import { logger } from '../utils/logger';
import { Connection } from 'typeorm';
import { Web3Source } from '../data_sources/events/web3';
import { calculateEndBlockAsync } from './utils/shared_utils';

import {
    ERC20BridgeTransferEvent,
    ExpiredRfqOrderEvent,
    FillEvent,
    NativeFill,
    OneinchSwappedEvent,
    ParaswapSwappedV4Event,
    ParaswapSwappedV5Event,
    SlingshotTradeEvent,
    TransformedERC20Event,
    V4CancelEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
} from '../entities';

import {
    EP_ADDRESS,
    EP_DEPLOYMENT_BLOCK,
    ETHEREUM_RPC_URL,
    FEAT_LIMIT_ORDERS,
    FEAT_ONEINCH_SWAPPED_EVENT,
    FEAT_PARASWAP_SWAPPED_V4_EVENT,
    FEAT_PARASWAP_SWAPPED_V5_EVENT,
    FEAT_PLP_SWAP_EVENT,
    FEAT_RFQ_EVENT,
    FEAT_SLINGSHOT_TRADE_EVENT,
    FEAT_TRANSFORMED_ERC20_EVENT,
    FEAT_UNISWAP_V3_VIP_SWAP_EVENT,
    FEAT_V3_FILL_EVENT,
    FEAT_V3_NATIVE_FILL,
    FEAT_VIP_SWAP_EVENT,
    FIRST_SEARCH_BLOCK,
    ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK,
    PARASWAP_V4_CONTRACT_ADDRESS,
    PARASWAP_V4_DEPLOYMENT_BLOCK,
    PARASWAP_V5_CONTRACT_ADDRESS,
    PARASWAP_V5_DEPLOYMENT_BLOCK,
    PLP_VIP_START_BLOCK,
    RFQ_EXPIRY_START_BLOCK,
    SLINGSHOT_DEPLOYMENT_BLOCK,
    V4_CANCEL_START_BLOCK,
    V4_FILL_START_BLOCK,
    VIP_SWAP_SOURCES,
} from '../config';
import {
    EXPIRED_RFQ_ORDER_EVENT_TOPIC,
    LIMITORDERFILLED_EVENT_TOPIC,
    LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
    ONEINCH_ROUTER_V3_CONTRACT_ADDRESS,
    ONEINCH_SWAPPED_EVENT_TOPIC,
    PARASWAP_SWAPPED_V4_EVENT_TOPIC,
    PARASWAP_SWAPPED_V5_EVENT_TOPIC,
    RFQORDERFILLED_EVENT_TOPIC,
    SLINGSHOT_CONTRACT_ADDRESS,
    SLINGSHOT_TRADE_EVENT_TOPIC,
    SWAP_EVENT_TOPIC,
    SWAP_V3_EVENT_TOPIC,
    TRANSFORMEDERC20_EVENT_TOPIC,
    V3_EXCHANGE_ADDRESS,
    V3_FILL_EVENT_TOPIC,
    V4_CANCEL_EVENT_TOPIC,
} from '../constants';

import { parseTransformedERC20Event } from '../parsers/events/transformed_erc20_events';
import { parseOneinchSwappedEvent } from '../parsers/events/oneinch_swapped_event';
import { parseParaswapSwappedV4Event, parseParaswapSwappedV5Event } from '../parsers/events/paraswap_swapped_event';
import { parseSlingshotTradeEvent } from '../parsers/events/slingshot_trade_event';
import { parseLiquidityProviderSwapEvent } from '../parsers/events/liquidity_provider_swap_events';
import {
    parseNativeFillFromV4RfqOrderFilledEvent,
    parseV4RfqOrderFilledEvent,
} from '../parsers/events/v4_rfq_order_filled_events';
import { parseUniswapV3SwapEvent } from '../parsers/events/swap_events';
import {
    parseNativeFillFromV4LimitOrderFilledEvent,
    parseV4LimitOrderFilledEvent,
} from '../parsers/events/v4_limit_order_filled_events';
import { parseFillEvent } from '../parsers/events/fill_events';
import { parseNativeFillFromFillEvent } from '../parsers/events/fill_events';
import { parseV4CancelEvent } from '../parsers/events/v4_cancel_events';
import { parseExpiredRfqOrderEvent } from '../parsers/events/expired_rfq_order_events';
import { parsePancakeSwapEvent } from '../parsers/events/swap_events';
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

        if (FEAT_ONEINCH_SWAPPED_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<OneinchSwappedEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'OneinchSwappedEvent',
                    OneinchSwappedEvent,
                    'oneinch_swapped_events',
                    ONEINCH_SWAPPED_EVENT_TOPIC,
                    ONEINCH_ROUTER_V3_CONTRACT_ADDRESS,
                    ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK,
                    parseOneinchSwappedEvent,
                    {},
                ),
            );
        }

        if (FEAT_VIP_SWAP_EVENT) {
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
                    EP_DEPLOYMENT_BLOCK,
                    parsePancakeSwapEvent,
                    { isDirectTrade: true, directProtocol: VIP_SWAP_SOURCES },
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
                    12553659, // first seen -1
                    parseUniswapV3SwapEvent,
                    { isDirectTrade: true, directProtocol: ['UniswapV3'] },
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
                    V4_FILL_START_BLOCK,
                    parseV4RfqOrderFilledEvent,
                    {},
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
                    V4_FILL_START_BLOCK,
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
                    RFQ_EXPIRY_START_BLOCK,
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
                    V4_FILL_START_BLOCK,
                    parseV4LimitOrderFilledEvent,
                    {},
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
                    V4_FILL_START_BLOCK,
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
                    V4_CANCEL_START_BLOCK,
                    parseV4CancelEvent,
                    {},
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

        await Promise.all(promises);

        const endTime = new Date().getTime();
        const scriptDurationSeconds = (endTime - startTime) / 1000;
        SCRIPT_RUN_DURATION.set({ script: 'events-by-topic' }, scriptDurationSeconds);

        logger.info(`finished pulling events by topic`);
        logger.info(`It took ${scriptDurationSeconds} seconds to complete`);
    }
}
