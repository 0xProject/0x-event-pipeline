import { Web3ProviderEngine } from '@0x/subproviders';
import { logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BlockWithoutTransactionData, Transaction, BlockWithTransactionData, RawLog } from 'ethereum-types';

const Web3 = require('web3');

export interface LogPullInfo {
    address: string;
    fromBlock: number;
    toBlock: number;
    topics: string[];
};

export class Web3Source {
    private readonly _web3Wrapper: Web3Wrapper;
    private readonly _web3: any;
    constructor(provider: Web3ProviderEngine, wsProvider: string) {
        this._web3Wrapper = new Web3Wrapper(provider);
        this._web3 = new Web3(wsProvider);
    }

    public async getBatchBlockInfoForRangeAsync(startBlock: number, endBlock: number): Promise<any[]> {
        const iter = Array.from(Array(endBlock - startBlock + 1).keys());
        var batch = new this._web3.BatchRequest();

        let promises = iter.map(i => {
            return new Promise((resolve, reject) => {
                let req = this._web3.eth.getBlock.request(i + startBlock, (err: any, data: BlockWithTransactionData) => {
                    if(err) reject(err);
                    else resolve(data);
                });
            batch.add(req)
            })
        });

        batch.execute();

        const blocks = await Promise.all(promises);

        return blocks;
    }

    public async getBatchTxInfoAsync(hashes: string[]): Promise<any[]> {
        var batch = new this._web3.BatchRequest();

        let promises = hashes.map(hash => {
            return new Promise((resolve, reject) => {
                let req = this._web3.eth.getTransaction.request(hash, (err: any, data: Transaction) => {
                    if(err) reject(err);
                    else resolve(data);
                });
            batch.add(req)
            })
        });

        batch.execute();

        const transactions = await Promise.all(promises);

        return transactions;
    }

    public async getBatchTxReceiptInfoAsync(hashes: string[]): Promise<any[]> {
        var batch = new this._web3.BatchRequest();

        let promises = hashes.map(hash => {
            return new Promise((resolve, reject) => {
                let req = this._web3.eth.getTransactionReceipt.request(hash, (err: any, data: Transaction) => {
                    if(err) reject(err);
                    else resolve(data);
                });
            batch.add(req)
            })
        });

        batch.execute();

        const transactionReceipts = await Promise.all(promises);

        return transactionReceipts;
    }

    public async getBatchLogInfoForContractsAsync(
        logPullInfo: LogPullInfo[]): Promise<any[]> {

        var batch = new this._web3.BatchRequest();

        let promises = logPullInfo.map(logPull => {
            return new Promise((resolve, reject) => {
                const reqParams = {
                    fromBlock: logPull.fromBlock,
                    toBlock: logPull.toBlock,
                    address: logPull.address,
                    topics: logPull.topics,
                }
                let req = this._web3.eth.getPastLogs.request( reqParams, (err: any, data: RawLog) => {
                    if(err) reject(err);
                    else resolve({ logPull, logs: data });
                });
            batch.add(req)
            })
        });

        batch.execute();

        const encodedLogs = await Promise.all(promises);

        return encodedLogs;
    }

    public async getBlockInfoForRangeAsync(startBlock: number, endBlock: number): Promise<BlockWithoutTransactionData[]> {
        const iter = Array.from(Array(endBlock - startBlock + 1).keys());
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

    public async getBlockNumberAsync(): Promise<number> {
        return this._web3Wrapper.getBlockNumberAsync();
    }

    public async getBlockTimestampAsync(blockNumber: number): Promise<number> {
        return this._web3Wrapper.getBlockTimestampAsync(blockNumber);
    }
    
}
