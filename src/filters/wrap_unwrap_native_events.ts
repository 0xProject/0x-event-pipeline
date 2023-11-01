const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';

import { BigNumber } from '@0x/utils';

import { Web3Source } from '../data_sources/events/web3';
import { Event, Transaction } from '../entities';
import { getParseTxsAsync } from '../scripts/utils/web3_utils';

export async function filterWrapUnwrapEvents(events: Event[], web3Source: Web3Source): Promise<Event[]> {
    if (events.length > 0) {
        const txHashes = events.map((log: Event) => log.transactionHash);
        const txData = await getParseTxsAsync(web3Source, txHashes);
        const filteredTxs = txData.parsedTxs.filter((tx: Transaction) => tx.affiliateAddress);

        const validTxHashSet = new Set(txHashes);
        const filteredLogs = events.filter((log: Event) => validTxHashSet.has(log.transactionHash));
    }
    return [];
}
