import { SOCKET_BRIDGE_MATCHA_METADATA } from '../constants';
import { Web3Source } from '../data_sources/events/web3';
import { Event, SocketBridgeEvent, Transaction } from '../entities';

export async function filterSocketBridgeEventsGetContext(events: Event[], _: Web3Source): Promise<Event[]> {
    return new Promise((resolve) =>
        resolve(
            events.filter((event: Event) => (event as SocketBridgeEvent).metadata === SOCKET_BRIDGE_MATCHA_METADATA),
        ),
    );
}

export function filterSocketBridgeEvents(events: Event[], _transaction: Transaction): Event[] {
    return events.filter((event: Event) => (event as SocketBridgeEvent).metadata === SOCKET_BRIDGE_MATCHA_METADATA);
}
