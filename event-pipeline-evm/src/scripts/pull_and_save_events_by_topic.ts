import { web3Factory } from '@0x/dev-utils';
import { logger } from '@0x/pipeline-utils';
import { Connection } from 'typeorm';
import { Web3Source } from '@0x/pipeline-utils';
import { calculateEndBlockAsync } from './utils/shared_utils';

import {
    ERC20BridgeTransferEvent,
    TransformedERC20Event,
    V4RfqOrderFilledEvent,
    V4LimitOrderFilledEvent,
    NativeFill,
    OneinchSwappedEvent,
    ParaswapSwappedEvent,
    SlingshotTradeEvent,
    V4CancelEvent,
    ExpiredRfqOrderEvent,
} from '../entities';

import {
    ETHEREUM_RPC_URL,
    FIRST_SEARCH_BLOCK,
    EP_DEPLOYMENT_BLOCK,
    FEAT_TRANSFORMED_ERC20_EVENT,
    FEAT_ONEINCH_SWAPPED_EVENT,
    FEAT_VIP_SWAP_EVENT,
    FEAT_SLINGSHOT_TRADE_EVENT,
    FEAT_PARASWAP_SWAPPED_EVENT,
    ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK,
    SLINGSHOT_DEPLOYMENT_BLOCK,
    VIP_SWAP_SOURCES,
    PARASWAP_CONTRACT_ADDRESS,
    PARASWAP_DEPLOYMENT_BLOCK,
} from '../config';
import {
    TRANSFORMEDERC20_EVENT_TOPIC,
    EXCHANGE_PROXY_ADDRESS,
    LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
    RFQORDERFILLED_EVENT_TOPIC,
    LIMITORDERFILLED_EVENT_TOPIC,
    EXPIRED_RFQ_ORDER_EVENT_TOPIC,
    V4_CANCEL_EVENT_TOPIC,
    SWAP_EVENT_TOPIC,
    ONEINCH_ROUTER_V3_CONTRACT_ADDRESS,
    ONEINCH_SWAPPED_EVENT_TOPIC,
    SLINGSHOT_CONTRACT_ADDRESS,
    SLINGSHOT_TRADE_EVENT_TOPIC,
    PARASWAP_SWAPPED_EVENT_TOPIC,
} from '../constants';

import { parseTransformedERC20Event } from '../parsers/events/transformed_erc20_events';
import { parseOneinchSwappedEvent } from '../parsers/events/oneinch_swapped_event';
import { parseParaswapSwappedEvent } from '../parsers/events/paraswap_swapped_event';
import { parseSlingshotTradeEvent } from '../parsers/events/slingshot_trade_event';
import { parseLiquidityProviderSwapEvent } from '../parsers/events/liquidity_provider_swap_events';
import {
    parseV4RfqOrderFilledEvent,
    parseNativeFillFromV4RfqOrderFilledEvent,
} from '../parsers/events/v4_rfq_order_filled_events';
import {
    parseV4LimitOrderFilledEvent,
    parseNativeFillFromV4LimitOrderFilledEvent,
} from '../parsers/events/v4_limit_order_filled_events';
import { parseV4CancelEvent } from '../parsers/events/v4_cancel_events';
import { parseExpiredRfqOrderEvent } from '../parsers/events/expired_rfq_order_events';
import { parsePancakeSwapEvent } from '../parsers/events/swap_events';

import { PullAndSaveEventsByTopic } from './utils/event_abi_utils';

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

        logger.info(`latest block with offset: ${latestBlockWithOffset}`);

        const promises: Promise<void>[] = [];

        if (FEAT_TRANSFORMED_ERC20_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<TransformedERC20Event>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'TransformedERC20Event',
                    'transformed_erc20_events',
                    TRANSFORMEDERC20_EVENT_TOPIC,
                    EXCHANGE_PROXY_ADDRESS,
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
                    'slingshot_trade_events',
                    SLINGSHOT_TRADE_EVENT_TOPIC,
                    SLINGSHOT_CONTRACT_ADDRESS,
                    SLINGSHOT_DEPLOYMENT_BLOCK,
                    parseSlingshotTradeEvent,
                    {},
                ),
            );
        }

        if (FEAT_PARASWAP_SWAPPED_EVENT) {
            promises.push(
                pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ParaswapSwappedEvent>(
                    connection,
                    web3Source,
                    latestBlockWithOffset,
                    'ParaswapSwappedEvent',
                    'paraswap_swapped_events',
                    PARASWAP_SWAPPED_EVENT_TOPIC,
                    PARASWAP_CONTRACT_ADDRESS,
                    PARASWAP_DEPLOYMENT_BLOCK,
                    parseParaswapSwappedEvent,
                    {},
                ),
            );
        }

        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ERC20BridgeTransferEvent>(
        //     connection,
        //     web3Source,
        //     latestBlockWithOffset,
        //     'LiquidityProviderSwapEvent',
        //     'erc20_bridge_transfer_events',
        //     LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
        //     EXCHANGE_PROXY_ADDRESS,
        //     EP_DEPLOYMENT_BLOCK,
        //     parseLiquidityProviderSwapEvent,
        //     { isDirectTrade: true, directProtocol: 'PLP' },
        // ),
        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4RfqOrderFilledEvent>(
        //     connection,
        //     web3Source,
        //     latestBlockWithOffset,
        //     'V4RfqOrderFilledEvent',
        //     'v4_rfq_order_filled_events',
        //     RFQORDERFILLED_EVENT_TOPIC,
        //     EXCHANGE_PROXY_ADDRESS,
        //     EP_DEPLOYMENT_BLOCK,
        //     parseV4RfqOrderFilledEvent,
        //     {},
        // ),
        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(
        //     connection,
        //     web3Source,
        //     latestBlockWithOffset,
        //     'NativeFillFromRFQV4',
        //     'native_fills',
        //     RFQORDERFILLED_EVENT_TOPIC,
        //     EXCHANGE_PROXY_ADDRESS,
        //     EP_DEPLOYMENT_BLOCK,
        //     parseNativeFillFromV4RfqOrderFilledEvent,
        //     { protocolVersion: 'v4', nativeOrderType: 'RFQ Order' },
        // ),
        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4LimitOrderFilledEvent>(
        //     connection,
        //     web3Source,
        //     latestBlockWithOffset,
        //     'V4LimitOrderFilledEvent',
        //     'v4_limit_order_filled_events',
        //     LIMITORDERFILLED_EVENT_TOPIC,
        //     EXCHANGE_PROXY_ADDRESS,
        //     EP_DEPLOYMENT_BLOCK,
        //     parseV4LimitOrderFilledEvent,
        //     {},
        // ),
        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(
        //     connection,
        //     web3Source,
        //     latestBlockWithOffset,
        //     'NativeFillFromLimitV4',
        //     'native_fills',
        //     LIMITORDERFILLED_EVENT_TOPIC,
        //     EXCHANGE_PROXY_ADDRESS,
        //     EP_DEPLOYMENT_BLOCK,
        //     parseNativeFillFromV4LimitOrderFilledEvent,
        //     { protocolVersion: 'v4', nativeOrderType: 'Limit Order' },
        // ),
        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4CancelEvent>(connection, web3Source, latestBlockWithOffset, 'V4CancelEvent', 'v4_cancel_events', V4_CANCEL_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_BLOCK, parseV4CancelEvent, {}),
        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ExpiredRfqOrderEvent>(connection, web3Source, latestBlockWithOffset, 'ExpiredRfqOrderEvent', 'expired_rfq_order_events', EXPIRED_RFQ_ORDER_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_BLOCK, parseExpiredRfqOrderEvent, {}),

        await Promise.all(promises);

        const endTime = new Date().getTime();
        logger.info(`finished pulling events by topic`);
        logger.info(`It took ${(endTime - startTime) / 1000} seconds to complete`);
    }
}
