import {
    Transaction as TransactionOld,
    BlockWithoutTransactionData as BlockWithoutTransactionDataOld,
    BlockWithTransactionData as BlockWithTransactionDataOld,
    TransactionReceipt as TransactionReceiptOld,
} from 'ethereum-types';

const utils = require('web3-utils');
const helpers = require('web3-core-helpers');
const formatter = helpers.formatters;

export interface Transaction extends TransactionOld {
    type: number;
}

export interface BlockWithoutTransactionData extends BlockWithoutTransactionDataOld {
    baseFeePerGas: number;
}
export interface BlockWithTransactionData extends BlockWithTransactionDataOld {
    baseFeePerGas: number;
    transactions: Transaction[];
}

export interface TransactionReceipt extends TransactionReceiptOld {
    effectiveGasPrice: number;
}

export const outputTransactionReceiptFormatter = (raw: any) => formatter.outputTransactionReceiptFormatter(raw);

export const alchemyBlockTransactionReceiptsFormatter = function (response: any): TransactionReceipt[] {
    if (typeof response !== 'object') {
        throw new Error('Received receipt is invalid: ' + response);
    }

    return response.receipts.map((receipt: any) => {
        if (receipt.blockNumber !== null) receipt.blockNumber = utils.hexToNumber(receipt.blockNumber);
        if (receipt.transactionIndex !== null) receipt.transactionIndex = utils.hexToNumber(receipt.transactionIndex);
        receipt.cumulativeGasUsed = utils.hexToNumber(receipt.cumulativeGasUsed);
        receipt.gasUsed = utils.hexToNumber(receipt.gasUsed);
        if (receipt.effectiveGasPrice) {
            receipt.effectiveGasPrice = utils.hexToNumber(receipt.effectiveGasPrice);
        }
        if (Array.isArray(receipt.logs)) {
            receipt.logs = receipt.logs.map(formatter.outputLogFormatter);
        }

        if (typeof receipt.status !== 'undefined' && receipt.status !== null) {
            receipt.status = Boolean(parseInt(receipt.status));
        }

        return receipt;
    });
};

export const outputBigNumberFormatter = function (number: number) {
    return utils.toBN(number).toString(10);
};

export const updatedTransactionFormater = function (tx: any): Transaction {
    if (tx.blockNumber !== null) tx.blockNumber = utils.hexToNumber(tx.blockNumber);
    if (tx.transactionIndex !== null) tx.transactionIndex = utils.hexToNumber(tx.transactionIndex);
    tx.nonce = utils.hexToNumber(tx.nonce);
    tx.gas = outputBigNumberFormatter(tx.gas);
    if (tx.type) tx.type = utils.hexToNumber(tx.type);
    if (tx.gasPrice) tx.gasPrice = outputBigNumberFormatter(tx.gasPrice);
    if (tx.maxFeePerGas) tx.maxFeePerGas = outputBigNumberFormatter(tx.maxFeePerGas);
    if (tx.maxPriorityFeePerGas) tx.maxPriorityFeePerGas = outputBigNumberFormatter(tx.maxPriorityFeePerGas);
    tx.value = outputBigNumberFormatter(tx.value);

    if (tx.to && utils.isAddress(tx.to)) {
        // tx.to could be `0x0` or `null` while contract creation
        tx.to = utils.toChecksumAddress(tx.to);
    } else {
        tx.to = null; // set to `null` if invalid address
    }

    if (tx.from) {
        tx.from = utils.toChecksumAddress(tx.from);
    }

    return tx;
};
export const updatedBlockFormatter = function (block: any): BlockWithTransactionData | BlockWithoutTransactionData {
    // transform to number
    block.gasLimit = utils.hexToNumber(block.gasLimit);
    block.gasUsed = utils.hexToNumber(block.gasUsed);
    block.size = utils.hexToNumber(block.size);
    block.timestamp = utils.hexToNumber(block.timestamp);
    if (block.number !== null) block.number = utils.hexToNumber(block.number);

    if (block.difficulty) block.difficulty = outputBigNumberFormatter(block.difficulty);
    if (block.totalDifficulty) block.totalDifficulty = outputBigNumberFormatter(block.totalDifficulty);

    if (Array.isArray(block.transactions)) {
        block.transactions.forEach(function (item: any) {
            if (!(typeof item === 'string')) {
                return updatedTransactionFormater(item);
            }
            return item;
        });
    }

    if (block.miner) block.miner = utils.toChecksumAddress(block.miner);

    if (block.baseFeePerGas) block.baseFeePerGas = utils.hexToNumber(block.baseFeePerGas);

    return block;
};
