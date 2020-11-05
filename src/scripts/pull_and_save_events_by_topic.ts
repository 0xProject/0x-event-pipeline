import { web3Factory } from '@0x/dev-utils';
import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';
import { Web3Source } from '../data_sources/web3';
import { calculateEndBlockAsync } from './utils/shared_utils';

import { ERC20BridgeTransferEvent, TransformedERC20Event } from '../entities';

import { ETHEREUM_RPC_URL } from '../config';
import {
    TRANSFORMEDERC20_EVENT_TOPIC,
    EXCHANGE_PROXY_ADDRESS,
    EXCHANGE_PROXY_DEPLOYMENT_BLOCK,
    LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
    PLP_VIP_START_BLOCK,
} from '../constants';
import { parseTransformedERC20Event } from '../parsers/events/transformed_erc20_events';
import { parseLiquidityProviderSwapEvent } from '../parsers/events/liquidity_provider_swap_events';

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
        ]);
    
        const endTime = new Date().getTime();
        logUtils.log(`finished pulling events by topic`);
        logUtils.log(`It took ${(endTime - startTime) / 1000 } seconds to complete`);
    };
};
