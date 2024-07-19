import { Web3Source } from '../data_sources/events/web3';
import { Event, Transaction } from '../entities';
import { getParseTxsAsync } from '../scripts/utils/web3_utils';

export async function filterWrapUnwrapEventsGetContext(events: Event[], web3Source: Web3Source): Promise<Event[]> {
    if (events.length > 0) {
        const txHashes = events.map((log: Event) => log.transactionHash);
        const txData = await getParseTxsAsync(web3Source, txHashes);
        const filteredTxsHashes = txData.parsedTxs
            .filter((tx: Transaction) => tx.affiliateAddress || tx.quoteId)
            .map((tx: Transaction) => tx.transactionHash);

        const validTxHashSet = new Set(filteredTxsHashes);
        const filteredLogs = events.filter((log: Event) => validTxHashSet.has(log.transactionHash));
        return filteredLogs;
    }
    return [];
}

export function filterWrapUnwrapEvents(events: Event[], transaction: Transaction): Event[] {
    if (transaction.affiliateAddress || transaction.quoteId) {
        return events;
    }
    return [];
}
