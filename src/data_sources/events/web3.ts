import { MAX_TX_TO_PULL, BLOCK_RECEIPTS_MODE } from '../../config';
import { chunk, logger } from '../../utils';
import {
    BlockWithTransactionData,
    BlockWithoutTransactionData,
    alchemyBlockTransactionReceiptsFormatter,
    updatedBlockFormatter,
    outputTransactionReceiptFormatter,
    Transaction,
    TransactionReceipt,
} from './web3_updated';
import { Web3ProviderEngine } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { RawLog } from 'ethereum-types';

const Web3 = require('web3');

export { BlockWithTransactionData, BlockWithoutTransactionData, Transaction, TransactionReceipt } from './web3_updated';

export interface LogPullInfo {
    address: string | null;
    fromBlock: number;
    toBlock: number;
    topics: (string | null)[];
}
export interface ContractCallInfo {
    to: string;
    data: string;
}

export class Web3Source {
    private readonly _web3Wrapper: Web3Wrapper;
    private readonly _web3: any;
    constructor(provider: Web3ProviderEngine, wsProvider: string) {
        this._web3Wrapper = new Web3Wrapper(provider);
        this._web3 = new Web3(wsProvider);

        if (BLOCK_RECEIPTS_MODE === 'standard') {
            this._web3.eth.extend({
                methods: [
                    {
                        name: 'getBlockReceipts',
                        call: 'eth_getBlockReceipts',
                        params: 1,
                        inputFormatter: [this._web3.utils.numberToHex],
                        outputFormatter: outputTransactionReceiptFormatter,
                    },
                ],
            });
        } else if (BLOCK_RECEIPTS_MODE === 'alchemy') {
            this._web3.eth.extend({
                methods: [
                    {
                        name: 'getBlockReceipts',
                        call: 'alchemy_getTransactionReceipts',
                        params: 1,
                        inputFormatter: [
                            (blockNumber: number) => ({ blockNumber: this._web3.utils.numberToHex(blockNumber) }),
                        ],
                        outputFormatter: alchemyBlockTransactionReceiptsFormatter,
                    },
                ],
            });
        }
        this._web3.eth.extend({
            methods: [
                {
                    name: 'getBlockByNumberN',
                    call: 'eth_getBlockByNumber',
                    params: 2,
                    inputFormatter: [this._web3.utils.numberToHex, null],
                    outputFormatter: updatedBlockFormatter,
                },
            ],
        });
    }

    public async getBatchBlockInfoForRangeAsync<B extends boolean>(
        startBlock: number,
        endBlock: number,
        includeTransactions: B,
    ): Promise<B extends true ? BlockWithTransactionData[] : BlockWithoutTransactionData[]>;

    public async getBatchBlockInfoForRangeAsync(
        startBlock: number,
        endBlock: number,
        includeTransactions: boolean,
    ): Promise<(BlockWithoutTransactionData | BlockWithTransactionData)[]> {
        const blockNumbers = Array.from(Array(endBlock - startBlock + 1).keys()).map((i) => i + startBlock);
        return this.getBatchBlockInfoAsync(blockNumbers, includeTransactions);
    }

    public async getBatchBlockInfoAsync<B extends boolean>(
        blockNumbers: number[],
        includeTransactions: B,
    ): Promise<B extends true ? BlockWithTransactionData[] : BlockWithoutTransactionData[]>;

    public async getBatchBlockInfoAsync(
        blockNumbers: number[],
        includeTransactions: boolean,
    ): Promise<(BlockWithoutTransactionData | BlockWithTransactionData)[]> {
        const batch = new this._web3.BatchRequest();

        const promises = blockNumbers.map((blockNumber) => {
            return new Promise<BlockWithoutTransactionData | BlockWithTransactionData>((resolve, reject) => {
                const req = this._web3.eth.getBlockByNumberN.request(
                    blockNumber,
                    includeTransactions,
                    (err: any, data: BlockWithTransactionData) => {
                        if (err) {
                            logger.error(`Blocks error: ${err}`);
                            reject(err);
                        } else resolve(data);
                    },
                );
                batch.add(req);
            });
        });

        batch.execute();

        const blocks = await Promise.all(promises);

        return blocks;
    }

    public async getBatchBlockReceiptsForRangeAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<TransactionReceipt[][]> {
        const blockNumbers = Array.from(Array(endBlock - startBlock + 1).keys()).map((i) => i + startBlock);
        return this.getBatchBlockReceiptsAsync(blockNumbers);
    }

    public async getBatchBlockReceiptsAsync(blockNumbers: number[]): Promise<TransactionReceipt[][]> {
        const promises = blockNumbers.map((blockNumber) => {
            return this._web3.eth.getBlockReceipts(blockNumber).catch((err: any) => {
                logger.error(`Blocks error: ${err}`);
            });
        });

        const blocks = await Promise.all(promises);

        return blocks;
    }

    public async getBatchTxInfoAsync(hashes: string[]): Promise<any[]> {
        return this.chunkedBatchWeb3CallAsync(hashes, (batch: any, hash: string) => {
            return new Promise((resolve, reject) => {
                const req = this._web3.eth.getTransaction.request(hash, (err: any, data: Transaction) => {
                    if (err) {
                        logger.error(`Transactions error: ${err}`);
                        reject(err);
                    } else resolve(data);
                });
                batch.add(req);
            });
        });
    }

    public async getBatchTxReceiptInfoAsync(hashes: string[]): Promise<any[]> {
        return this.chunkedBatchWeb3CallAsync(hashes, (batch: any, hash: string) => {
            return new Promise((resolve, reject) => {
                const req = this._web3.eth.getTransactionReceipt.request(hash, (err: any, data: Transaction) => {
                    if (err) {
                        logger.error(`Receipts error: ${err}`);
                        reject(err);
                    } else resolve(data);
                });
                batch.add(req);
            });
        });
    }

    public async getBatchLogInfoForContractsAsync(logPullInfo: LogPullInfo[]): Promise<any[]> {
        return this.chunkedBatchWeb3CallAsync(logPullInfo, (batch: any, logPull: LogPullInfo) => {
            return new Promise((resolve, reject) => {
                const reqParams = {
                    fromBlock: logPull.fromBlock,
                    toBlock: logPull.toBlock,
                    address: logPull.address,
                    topics: logPull.topics,
                };
                const req = this._web3.eth.getPastLogs.request(reqParams, (err: any, data: RawLog) => {
                    if (err) {
                        logger.error(`Logs error: ${err}`);
                        reject(err);
                    } else resolve({ logPull, logs: data });
                });
                batch.add(req);
            });
        });
    }

    public async callContractMethodsAsync(contractCallInfo: ContractCallInfo[]): Promise<any[]> {
        return this.chunkedBatchWeb3CallAsync(contractCallInfo, (batch: any, contractCall: ContractCallInfo) => {
            return new Promise((resolve, reject) => {
                const req = this._web3.eth.call.request(contractCall, (err: any, data: string) => {
                    if (err) {
                        logger.error(`Contract Call error: ${err}`);
                        reject(err);
                    } else resolve(data);
                });
                batch.add(req);
            });
        });
    }

    async chunkedBatchWeb3CallAsync(payload: any[], proccesingFunction: any): Promise<any[]> {
        const chunkedPayload = chunk(payload, MAX_TX_TO_PULL);
        const promises: Promise<any>[] = [];
        for (const chunk of chunkedPayload) {
            const batch = new this._web3.BatchRequest();

            promises.push(...(chunk.map(async (pld) => proccesingFunction(batch, pld)) as Promise<any>[]));
            batch.execute();
        }

        const resolvedPayloads = await Promise.all(promises);

        return resolvedPayloads;
    }

    public async callContractMethodsNullRevertAsync(contractCallInfo: ContractCallInfo[]): Promise<any[]> {
        const batch = new this._web3.BatchRequest();

        const promises = contractCallInfo.map((contractCall) => {
            return new Promise((resolve, _reject) => {
                const req = this._web3.eth.call.request(contractCall, (err: any, data: string) => {
                    if (err) {
                        resolve(null);
                    } else resolve(data);
                });
                batch.add(req);
            });
        });

        batch.execute();

        const contractMethodValues = await Promise.all(promises);

        return contractMethodValues;
    }

    public async getBlockInfoForRangeAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<BlockWithoutTransactionData[]> {
        const iter = Array.from(Array(endBlock - startBlock + 1).keys());
        const blocks = await Promise.all(iter.map((num) => this.getBlockInfoAsync(num + startBlock)));

        return blocks;
    }

    public async getBlockInfoAsync(blockNumber: number): Promise<BlockWithoutTransactionData> {
        try {
            logger.debug(`Fetching block ${blockNumber}`);

            const block = (await this._web3Wrapper.getBlockIfExistsAsync(blockNumber)) as BlockWithoutTransactionData;

            if (block == null) {
                throw new Error(`Block ${blockNumber} returned null`);
            }
            return block;
        } catch (err) {
            throw new Error(`Encountered error while fetching block ${blockNumber}: ${err}`);
        }
    }

    public async getCurrentBlockAsync(): Promise<BlockWithoutTransactionData> {
        const blockNumber = await this._web3Wrapper.getBlockNumberAsync();
        return this.getBlockInfoAsync(blockNumber);
    }

    public async getTransactionInfoAsync(txHash: string): Promise<Transaction> {
        return (await this._web3Wrapper.getTransactionByHashAsync(txHash)) as Transaction;
    }

    public async getBlockNumberAsync(): Promise<number> {
        return this._web3Wrapper.getBlockNumberAsync();
    }

    public async getBlockTimestampAsync(blockNumber: number): Promise<number> {
        return this._web3Wrapper.getBlockTimestampAsync(blockNumber);
    }

    public async getChainIdAsync(): Promise<number> {
        return this._web3.eth.getChainId();
    }
}
