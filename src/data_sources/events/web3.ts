import { EVM_RPC_URL, MAX_TX_TO_PULL } from '../../config';
import { chunk, logger } from '../../utils';
import {
    BlockWithTransactionData,
    BlockWithoutTransactionData,
    RawLog,
    Transaction,
    TransactionReceipt,
} from 'ethereum-types';
import { createPublicClient, http, PublicClient } from 'viem';
import { mainnet } from 'viem/chains';

const helpers = require('web3-core');
const formatter = helpers.formatters;

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

export interface Transaction1559 extends Transaction {
    type: number;
}

export interface BlockWithoutTransactionData1559 extends BlockWithoutTransactionData {
    baseFeePerGas: number;
}
export interface BlockWithTransactionData1559 extends BlockWithTransactionData {
    baseFeePerGas: number;
    transactions: Transaction1559[];
}

export interface TransactionReceipt1559 extends TransactionReceipt {
    effectiveGasPrice: number;
}

export class Web3Source {
    private _client: PublicClient;
    constructor() {
        this._client = createPublicClient({
            chain: mainnet,

            transport: http(EVM_RPC_URL),
            batch: {
                multicall: true,
            },
        });
        /*
        this._web3.eth.extend({
            methods: [
                {
                    name: 'getBlockReceipts',
                    call: 'eth_getBlockReceipts',
                    params: 1,
                    inputFormatter: [this._web3.utils.numberToHex],
                    outputFormatter: (block: any) => formatter.outputTransactionReceiptFormatter(block),
                },
            ],
        });
  */
    }

    public async getBatchBlocksRange<B extends boolean>(
        startBlock: number,
        endBlock: number,
        includeTransactions: B,
    ): Promise<B extends true ? BlockWithTransactionData1559[] : BlockWithoutTransactionData1559[]>;

    public async getBatchBlocksRange(
        startBlock: number,
        endBlock: number,
        includeTransactions: boolean,
    ): Promise<(BlockWithoutTransactionData | BlockWithTransactionData1559)[]> {
        const blockNumbers = Array.from(Array(endBlock - startBlock + 1).keys()).map((i) => i + startBlock);
        return this.getBatchBlocks(blockNumbers, includeTransactions);
    }

    public async getBatchBlocks<B extends boolean>(
        blockNumbers: bigint[],
        includeTransactions: B,
    ): Promise<B extends true ? BlockWithTransactionData1559[] : BlockWithoutTransactionData1559[]>;

    public async getBatchBlocks(
        blockNumbers: bigint[],
        includeTransactions: boolean,
    ): Promise<(BlockWithoutTransactionData | BlockWithTransactionData1559)[]> {

        const promises = blockNumbers.map((blockNumber) => {
            return this._client.getBlock({ blockNumber });
        }
            /*
            return new Promise<BlockWithoutTransactionData | BlockWithTransactionData1559>((resolve, reject) => {
                const req = this._web3.eth.getBlock.request(
                    blockNumber,
                    includeTransactions,
                    (err: any, data: BlockWithTransactionData1559) => {
                        if (err) {
                            logger.error(`Blocks error: ${err}`);
                            reject(err);
                        } else resolve(data);
                    },
                );
                batch.add(req);
            });
        });
            */


        return await Promise.all(promises);

    }

    /*
    public async getBatchBlockReceiptsForRangeAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<TransactionReceipt1559[][]> {
        const blockNumbers = Array.from(Array(endBlock - startBlock + 1).keys()).map((i) => i + startBlock);
        return this.getBatchBlockReceiptsAsync(blockNumbers);
    }

    public async getBatchBlockReceiptsAsync(blockNumbers: number[]): Promise<TransactionReceipt1559[][]> {
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
                    address: logPull.address === 'nofilter' ? null : logPull.address,
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
*/
    public async getBlockInfoForRangeAsync(
        startBlock: number,
        endBlock: number,
    ): Promise<BlockWithoutTransactionData[]> {
        const iter = Array.from(Array(endBlock - startBlock + 1).keys());
        const blocks = await Promise.all(iter.map((num) => this.getBlockInfo(num + startBlock)));

        return blocks;
    }

    public async getBlockInfo(blockNumber: number): Promise<BlockWithoutTransactionData> {
        return this._client.getBlock({ blockNumber: blockNumber });
        /*    try {
            logger.debug(`Fetching block ${blockNumber}`);

            const block = await this._web3Wrapper.getBlockIfExistsAsync(blockNumber);

            if (block == null) {
                throw new Error(`Block ${blockNumber} returned null`);
            }
            return block;
        } catch (err) {
            throw new Error(`Encountered error while fetching block ${blockNumber}: ${err}`);
        }
   */
    }

    public async getCurrentBlock(): Promise<BlockWithoutTransactionData> {
        return this._client.getBlock();
    }

    public async getTransaction(txHash: string): Promise<Transaction> {
        return this._client.getTransaction(txHash);
    }

    public async getBlockNumber(): Promise<bigint> {
        return this._client.getBlockNumber();
    }

    /*
    public async getBlockTimestampAsync(blockNumber: number): Promise<number> {
        return this._web3Wrapper.getBlockTimestampAsync(blockNumber);
    }
*/
    public async getChainId(): Promise<bigint> {
        return this._client.getChainId().then((chainId: number) => bigint(chainId));
    }
}
