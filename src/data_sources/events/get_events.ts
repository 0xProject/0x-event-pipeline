import { DecodedLogArgs, LogWithDecodedArgs } from 'ethereum-types';

import { logger } from '../../utils/logger';

const NUM_RETRIES = 1; // Number of retries if a request fails or times out.

export type GetEventsFunc<ArgsType extends DecodedLogArgs> = (
    fromBlock: number,
    toBlock: number,
) => Promise<Array<LogWithDecodedArgs<ArgsType>>>;

/**
 * Gets all events between the given startBlock and endBlock by querying for
 * NUM_BLOCKS_PER_QUERY at a time. Accepts a getter function in order to
 * maximize code re-use and allow for getting different types of events for
 * different contracts. If the getter function throws with a retryable error,
 * it will automatically be retried up to NUM_RETRIES times.
 * @param getEventsAsync A getter function which will be called for each step during pagination.
 * @param startBlock The start of the entire block range to get events for.
 * @param endBlock The end of the entire block range to get events for.
 */
export async function getEventsWithPaginationAsync<ArgsType extends DecodedLogArgs>(
    getEventsAsync: GetEventsFunc<ArgsType>,
    startBlock: number,
    endBlock: number,
): Promise<Array<LogWithDecodedArgs<ArgsType>> | null> {
    let events: Array<LogWithDecodedArgs<ArgsType>> = [];

    for (let fromBlock = startBlock; fromBlock <= endBlock; fromBlock += numPaginationBlocks()) {
        const toBlock = Math.min(fromBlock + numPaginationBlocks() - 1, endBlock);

        logger.child({ fromBlock, toBlock }).info(`Query for events in block range ${fromBlock}-${toBlock}`);

        const eventsInRange = await _getEventsWithRetriesAsync(getEventsAsync, NUM_RETRIES, fromBlock, toBlock);
        if (eventsInRange === null) {
            return null;
        } else {
            events = events.concat(eventsInRange);
        }
    }

    logger
        .child({ count: events.length, startBlock, endBlock })
        .info(`Retrieved ${events.length} events from block range ${startBlock}-${endBlock}`);
    return events;
}

/**
 * Calls the getEventsAsync function and retries up to numRetries times if it
 * throws with an error that is considered retryable.
 * @param getEventsAsync a function that will be called on each iteration.
 * @param numRetries the maximum number times to retry getEventsAsync if it fails with a retryable error.
 * @param fromBlock the start of the sub-range of blocks we are getting events for.
 * @param toBlock the end of the sub-range of blocks we are getting events for.
 */
async function _getEventsWithRetriesAsync<ArgsType extends DecodedLogArgs>(
    getEventsAsync: GetEventsFunc<ArgsType>,
    numRetries: number,
    fromBlock: number,
    toBlock: number,
): Promise<Array<LogWithDecodedArgs<ArgsType>> | null> {
    let eventsInRange: Array<LogWithDecodedArgs<ArgsType>> = [];
    for (let i = 0; i <= numRetries; i++) {
        logger.child({ retry: i, fromBlock, toBlock }).info(`Retry ${i}: ${fromBlock}-${toBlock}`);
        try {
            eventsInRange = await getEventsAsync(fromBlock, toBlock);
        } catch (err) {
            if (err instanceof Error) {
                if (_isErrorRetryable(err) && i < numRetries) {
                    continue;
                } else {
                    logger.error(err);
                    return null;
                }
            } else {
                logger.error(err);
            }
        }
        break;
    }
    return eventsInRange;
}

function _isErrorRetryable(err: Error): boolean {
    return err.message.includes('network timeout');
}

// leaving this function available for use
// tslint:disable custom-no-magic-numbers
function numPaginationBlocks(): number {
    return 500;
}
