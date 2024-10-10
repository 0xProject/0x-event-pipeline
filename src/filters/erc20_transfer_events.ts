import { Web3Source } from '../data_sources/events/web3';
import { Event, Transaction } from '../entities';
import { getParseTxsAsync } from '../scripts/utils/web3_utils';

export async function filterERC20TransferEventsGetContext(
    events: Event[],
    web3Source: Web3Source,
    allowedTxnList?: Set<string>,
): Promise<Event[]> {
    if (events.length > 0) {
        const txHashes = events.map((log: Event) => log.transactionHash);
        let validTxHashSet: Set<string>;
        if (allowedTxnList && allowedTxnList.size > 0) {
            validTxHashSet = allowedTxnList;
        } else {
            const txData = await getParseTxsAsync(web3Source, txHashes);
            const filteredTxsHashes = txData.parsedTxs
                .filter((tx: Transaction) => tx.quoteId)
                .map((tx: Transaction) => tx.transactionHash);

            validTxHashSet = new Set(filteredTxsHashes);
        }

        const filteredLogs = events.filter((log: Event) => validTxHashSet.has(log.transactionHash));
        return filteredLogs.filter((e) => e !== null);
    }
    return [];
}

export function filterERC20TransferEvents(
    events: Event[],
    transaction: Transaction,
    allowedTxnList?: Set<string>,
): Event[] {
    const filteredEvents = new Set<Event>();

    if (allowedTxnList && allowedTxnList.size > 0 && allowedTxnList.has(transaction.transactionHash)) {
        events.filter((e) => e !== null).forEach((e) => filteredEvents.add(e));
    }

    if (transaction.quoteId) {
        events.filter((e) => e !== null).forEach((e) => filteredEvents.add(e));
    }

    return Array.from(filteredEvents);
}
