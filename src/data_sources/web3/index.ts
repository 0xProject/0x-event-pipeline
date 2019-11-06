import { Web3ProviderEngine } from '@0x/subproviders';
import { logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BlockWithoutTransactionData, Transaction } from 'ethereum-types';

export class Web3Source {
    private readonly _web3Wrapper: Web3Wrapper;
    constructor(provider: Web3ProviderEngine) {
        this._web3Wrapper = new Web3Wrapper(provider);
    }

    public async getBlockInfoForRangeAsync(startBlock: number, endBlock: number): Promise<BlockWithoutTransactionData[]> {
        const iter = Array.from(Array(endBlock - startBlock).keys())
        const blocks = await Promise.all(iter.map(num => this.getBlockInfoAsync(num + startBlock)));

        return blocks
    }

    public async getBlockInfoAsync(blockNumber: number): Promise<BlockWithoutTransactionData> {
        try {
            logUtils.log(`Fetching block ${blockNumber}`);

            const block = await this._web3Wrapper.getBlockIfExistsAsync(blockNumber);

            if (block == null) {
                throw new Error(`Block ${blockNumber} returned null`);
            }
            return block;
        } catch (err) {
            return Promise.reject(new Error(`Encountered error while fetching block ${blockNumber}: ${err}`));
        }
    }

    public async getTransactionInfoAsync(txHash: string): Promise<Transaction> {
        return this._web3Wrapper.getTransactionByHashAsync(txHash);
    }
}
