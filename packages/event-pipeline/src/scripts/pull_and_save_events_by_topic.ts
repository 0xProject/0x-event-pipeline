import { web3Factory } from '@0x/dev-utils';
import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';
import { Web3Source } from '../data_sources/web3';
import { calculateEndBlockAsync } from './utils/shared_utils';

import { ERC20BridgeTransferEvent, TransformedERC20Event, V4RfqOrderFilledEvent, V4LimitOrderFilledEvent, NativeFill, FillEvent} from '../entities';

import { ETHEREUM_RPC_URL, FIRST_SEARCH_BLOCK } from '../config';
import {
    TRANSFORMEDERC20_EVENT_TOPIC,
    EXCHANGE_PROXY_ADDRESS,
    V3_EXCHANGE_ADDRESS,
    EXCHANGE_PROXY_DEPLOYMENT_BLOCK,
    LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
    PLP_VIP_START_BLOCK,
    RFQORDERFILLED_EVENT_TOPIC,
    LIMITORDERFILLED_EVENT_TOPIC,
    V4_FILL_START_BLOCK,
    V3_FILL_EVENT_TOPIC,
    // TODO start block
} from '../constants';

import { parseTransformedERC20Event } from '../parsers/events/transformed_erc20_events';
import { parseLiquidityProviderSwapEvent } from '../parsers/events/liquidity_provider_swap_events';
import { parseV4RfqOrderFilledEvent, parseNativeFillFromV4RfqOrderFilledEvent } from '../parsers/events/v4_rfq_order_filled_events';
import { parseV4LimitOrderFilledEvent, parseNativeFillFromV4LimitOrderFilledEvent } from '../parsers/events/v4_limit_order_filled_events';
import { parseFillEvent } from '../parsers/events/fill_events';
import { parseNativeFillFromFillEvent } from '../parsers/events/fill_events';

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
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<TransformedERC20Event>(connection, web3Source, latestBlockWithOffset, 'TransformedERC20Event', 'transformed_erc20_events', TRANSFORMEDERC20_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EXCHANGE_PROXY_DEPLOYMENT_BLOCK, parseTransformedERC20Event, {}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ERC20BridgeTransferEvent>(connection, web3Source, latestBlockWithOffset, 'LiquidityProviderSwapEvent', 'erc20_bridge_transfer_events', LIQUIDITYPROVIDERSWAP_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, PLP_VIP_START_BLOCK, parseLiquidityProviderSwapEvent, {isDirectTrade: true, directProtocol:'PLP'}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4RfqOrderFilledEvent>(connection, web3Source, latestBlockWithOffset, 'V4RfqOrderFilledEvent', 'v4_rfq_order_filled_events', RFQORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, V4_FILL_START_BLOCK, parseV4RfqOrderFilledEvent, {}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(connection, web3Source, latestBlockWithOffset, 'NativeFillFromRFQV4', 'native_fills', RFQORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, V4_FILL_START_BLOCK, parseNativeFillFromV4RfqOrderFilledEvent, {protocolVersion:'v4', nativeOrderType:'RFQ Order'}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4LimitOrderFilledEvent>(connection, web3Source, latestBlockWithOffset, 'V4LimitOrderFilledEvent', 'v4_limit_order_filled_events', LIMITORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, V4_FILL_START_BLOCK, parseV4LimitOrderFilledEvent, {}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(connection, web3Source, latestBlockWithOffset, 'NativeFillFromLimitV4', 'native_fills', LIMITORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, V4_FILL_START_BLOCK, parseNativeFillFromV4LimitOrderFilledEvent, {protocolVersion:'v4', nativeOrderType:'Limit Order'}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<FillEvent>(connection, web3Source, latestBlockWithOffset, 'FillEvent', 'fill_events', V3_FILL_EVENT_TOPIC, V3_EXCHANGE_ADDRESS, FIRST_SEARCH_BLOCK, parseFillEvent, {}),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(connection, web3Source, latestBlockWithOffset, 'NativeFillFromV3', 'native_fills', V3_FILL_EVENT_TOPIC, V3_EXCHANGE_ADDRESS, FIRST_SEARCH_BLOCK, parseNativeFillFromFillEvent, {protocolVersion:'v3'}),
        ]);

        const endTime = new Date().getTime();
        logUtils.log(`finished pulling events by topic`);
        logUtils.log(`It took ${(endTime - startTime) / 1000 } seconds to complete`);
    };
};
