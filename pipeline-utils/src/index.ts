export * from './abis';
export { logger } from './logger';
export { GetEventsFunc, getEventsWithPaginationAsync } from './sources/get_events';
export { ContractCallInfo, LogPullInfo, Web3Source } from './sources/web3';
export * from './transformers';

import { BigNumber } from '@0x/utils';
import { logger } from './logger';

export {
    Block,
    ERC20BridgeTransferEvent,
    ExpiredRfqOrderEvent,
    Event,
    LastBlockProcessed,
    NativeFill,
    OneinchSwappedEvent,
    ParamsSetEvent,
    ParaswapSwappedEvent,
    SlingshotTradeEvent,
    TransactionLogs,
    TransactionReceipt,
    Transaction,
    TransformedERC20Event,
    V4CancelEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
} from './entities';

/**
 * If the given BigNumber is not null, returns the string representation of that
 * number. Otherwise, returns null.
 * @param n The number to convert.
 */
export function bigNumbertoStringOrNull(n: BigNumber): string | null {
    if (n == null) {
        return null;
    }
    return n.toString();
}

/**
 * Logs an error by intelligently checking for `message` and `stack` properties.
 * Intended for use with top-level immediately invoked asynchronous functions.
 * @param e the error to log.
 */
export function handleError(e: any): void {
    if (e.message != null) {
        // tslint:disable-next-line:no-console
        logger.error(e.message);
    } else {
        // tslint:disable-next-line:no-console
        logger.error('Unknown error');
    }
    if (e.stack != null) {
        // tslint:disable-next-line:no-console
        logger.error(e.stack);
    } else {
        // tslint:disable-next-line:no-console
        logger.error('(No stack trace)');
    }
    process.exit(1);
}
