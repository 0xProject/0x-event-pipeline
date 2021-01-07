import { web3Factory } from '@0x/dev-utils';
import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';
import { Web3Source } from '../data_sources/web3';
import { calculateEndBlockAsync } from './utils/shared_utils';

import { ERC20BridgeTransferEvent, TransformedERC20Event, RfqOrderFilledEvent, LimitOrderFilledEvent, NativeFill} from '../entities';

import { ETHEREUM_RPC_URL } from '../config';
import {
    TRANSFORMEDERC20_EVENT_TOPIC,
    EXCHANGE_PROXY_ADDRESS,
    EXCHANGE_PROXY_DEPLOYMENT_BLOCK,
    LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
    PLP_VIP_START_BLOCK,
    RFQORDERFILLED_EVENT_TOPIC,
    LIMITORDERFILLED_EVENT_TOPIC,
    V4_FILL_START_BLOCK
    // TODO start block
} from '../constants';
import { parseTransformedERC20Event } from '../parsers/events/transformed_erc20_events';
import { parseLiquidityProviderSwapEvent } from '../parsers/events/liquidity_provider_swap_events';
import { parseRfqOrderFilledEvent } from '../parsers/events/rfq_order_filled_events';
import { parseNativeFillFromRfqOrderFilledEvent } from '../parsers/events/rfq_order_filled_events';
import { parseLimitOrderFilledEvent } from '../parsers/events/limit_order_filled_events';
import { parseNativeFillFromLimitOrderFilledEvent } from '../parsers/events/limit_order_filled_events';

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
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<TransformedERC20Event>(connection, web3Source, latestBlockWithOffset, 'TransformedERC20Event', 'transformed_erc20_events', TRANSFORMEDERC20_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EXCHANGE_PROXY_DEPLOYMENT_BLOCK, parseTransformedERC20Event, false, 'doesntmatter'),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ERC20BridgeTransferEvent>(connection, web3Source, latestBlockWithOffset, 'LiquidityProviderSwapEvent', 'erc20_bridge_transfer_events', LIQUIDITYPROVIDERSWAP_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, PLP_VIP_START_BLOCK, parseLiquidityProviderSwapEvent, true, 'PLP'),

            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<RfqOrderFilledEvent>(connection, web3Source, latestBlockWithOffset, 'RfqOrderFilledEvent', 'rfq_order_fills_v4', RFQORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, V4_FILL_START_BLOCK, parseRfqOrderFilledEvent, false, 'doesntmatter'),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(connection, web3Source, latestBlockWithOffset, 'NativeFill', 'native_fills_v4', RFQORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, V4_FILL_START_BLOCK, parseNativeFillFromRfqOrderFilledEvent, false, 'doesntmatter'),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<LimitOrderFilledEvent>(connection, web3Source, latestBlockWithOffset, 'LimitOrderFilledEvent', 'limit_order_fills_v4', LIMITORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, V4_FILL_START_BLOCK, parseLimitOrderFilledEvent, false, 'doesntmatter'),
            pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(connection, web3Source, latestBlockWithOffset, 'NativeFill', 'native_fills_v4', LIMITORDERFILLED_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, V4_FILL_START_BLOCK, parseNativeFillFromLimitOrderFilledEvent, false, 'doesntmatter'),
        ]);

        const endTime = new Date().getTime();
        logUtils.log(`finished pulling events by topic`);
        logUtils.log(`It took ${(endTime - startTime) / 1000 } seconds to complete`);
    };
};
