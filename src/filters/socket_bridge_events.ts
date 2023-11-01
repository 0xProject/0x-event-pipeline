const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';

import { BigNumber } from '@0x/utils';

import { Web3Source } from '../data_sources/events/web3';
import { Event, SocketBridgeEvent } from '../entities';
import { SOCKET_BRIDGE_MATCHA_METADATA } from '../constants';

export async function filterSocketBridgeEvents(events: Event[], _: Web3Source): Promise<Event[]> {
    return new Promise((resolve) =>
        resolve(
            events.filter((event: Event) => (event as SocketBridgeEvent).metadata === SOCKET_BRIDGE_MATCHA_METADATA),
        ),
    );
}
