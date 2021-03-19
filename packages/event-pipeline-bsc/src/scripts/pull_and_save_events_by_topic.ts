import { web3Factory } from '@0x/dev-utils';
import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';
import { Web3Source } from '../data_sources/web3';
import { calculateEndBlockAsync } from './utils/shared_utils';

import { 
    ERC20BridgeTransferEvent, 
    TransformedERC20Event, 
    V4RfqOrderFilledEvent, 
    V4LimitOrderFilledEvent, 
    NativeFill, 
    V4CancelEvent, 
    ExpiredRfqOrderEvent
} from '../entities';

import { ETHEREUM_RPC_URL, FIRST_SEARCH_BLOCK } from '../config';
import {
    TRANSFORMEDERC20_EVENT_TOPIC,
    EXCHANGE_PROXY_ADDRESS,
    LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
    RFQORDERFILLED_EVENT_TOPIC,
    LIMITORDERFILLED_EVENT_TOPIC,
    EXPIRED_RFQ_ORDER_EVENT_TOPIC,
    V4_CANCEL_EVENT_TOPIC,
    SWAP_EVENT_TOPIC,
    EP_DEPLOYMENT_START_BLOCK,
} from '../constants';

import { parseTransformedERC20Event } from '../parsers/events/transformed_erc20_events';
import { parseLiquidityProviderSwapEvent } from '../parsers/events/liquidity_provider_swap_events';
import { parseV4RfqOrderFilledEvent, parseNativeFillFromV4RfqOrderFilledEvent } from '../parsers/events/v4_rfq_order_filled_events';
import { parseV4LimitOrderFilledEvent, parseNativeFillFromV4LimitOrderFilledEvent } from '../parsers/events/v4_limit_order_filled_events';
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
        logUtils.log(`pulling events`);
        const latestBlockWithOffset = await calculateEndBlockAsync(web3Source);

        logUtils.log(`latest block with offset: ${latestBlockWithOffset}`);

        await Promise.all([
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<TransformedERC20Event>(connection, web3Source, latestBlockWithOffset, 'TransformedERC20Event', 'transformed_erc20_events', TRANSFORMEDERC20_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_START_BLOCK, parseTransformedERC20Event, {}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ERC20BridgeTransferEvent>(connection, web3Source, latestBlockWithOffset, 'LiquidityProviderSwapEvent', 'erc20_bridge_transfer_events', LIQUIDITYPROVIDERSWAP_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_START_BLOCK, parseLiquidityProviderSwapEvent, {isDirectTrade: true, directProtocol:'PLP'}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4RfqOrderFilledEvent>(connection, web3Source, latestBlockWithOffset, 'V4RfqOrderFilledEvent', 'v4_rfq_order_filled_events', RFQORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_START_BLOCK, parseV4RfqOrderFilledEvent, {}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(connection, web3Source, latestBlockWithOffset, 'NativeFillFromRFQV4', 'native_fills', RFQORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_START_BLOCK, parseNativeFillFromV4RfqOrderFilledEvent, {protocolVersion:'v4', nativeOrderType:'RFQ Order'}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4LimitOrderFilledEvent>(connection, web3Source, latestBlockWithOffset, 'V4LimitOrderFilledEvent', 'v4_limit_order_filled_events', LIMITORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_START_BLOCK, parseV4LimitOrderFilledEvent, {}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(connection, web3Source, latestBlockWithOffset, 'NativeFillFromLimitV4', 'native_fills', LIMITORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_START_BLOCK, parseNativeFillFromV4LimitOrderFilledEvent, {protocolVersion:'v4', nativeOrderType:'Limit Order'}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4CancelEvent>(connection, web3Source, latestBlockWithOffset, 'V4CancelEvent', 'v4_cancel_events', V4_CANCEL_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_START_BLOCK, parseV4CancelEvent, {}), 
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ExpiredRfqOrderEvent>(connection, web3Source, latestBlockWithOffset, 'ExpiredRfqOrderEvent', 'expired_rfq_order_events', EXPIRED_RFQ_ORDER_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_START_BLOCK, parseExpiredRfqOrderEvent, {}), 
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ERC20BridgeTransferEvent>(connection, web3Source, latestBlockWithOffset, 'PancakeVIPEvent', 'swap_events', SWAP_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_START_BLOCK, parsePancakeSwapEvent, {isDirectTrade: true, directProtocol:'PancakeSwap'}),         
        ]);

        const endTime = new Date().getTime();
        logUtils.log(`finished pulling events by topic`);
        logUtils.log(`It took ${(endTime - startTime) / 1000 } seconds to complete`);
    };
};
