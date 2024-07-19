export { filterSocketBridgeEventsGetContext, filterSocketBridgeEvents } from './socket_bridge_events';
export { filterWrapUnwrapEvents, filterWrapUnwrapEventsGetContext } from './wrap_unwrap_native_events';
export { filterERC20TransferEvents, filterERC20TransferEventsGetContext } from './erc20_transfer_events';

export const filterNulls = (events: any[], _: any) => events.filter((e) => e !== null);
