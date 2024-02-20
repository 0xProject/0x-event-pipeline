import { ZEROEX_API_AFFILIATE_SELECTOR } from '../../constants';
import {
    BlockWithoutTransactionData,
    TransactionReceipt as RawReceipt,
    Transaction as EVMTransaction,
} from '../../data_sources/events/web3';
import { Block, Transaction, TransactionLogs, TransactionReceipt } from '../../entities';
import { BigNumber } from '@0x/utils';

/**
 * Converts a raw tx into a Transaction entity
 * @param rawTx Raw transaction returned from JSON RPC
 */
export function parseTransaction(rawTx: EVMTransaction): Transaction {
    const transaction = new Transaction();

    transaction.observedTimestamp = new Date().getTime();
    transaction.transactionHash = rawTx.hash === null ? '' : rawTx.hash;
    transaction.nonce = rawTx.nonce;
    transaction.blockHash = rawTx.blockHash === null ? '' : rawTx.blockHash;
    transaction.blockNumber = rawTx.blockNumber === null ? 0 : rawTx.blockNumber;
    transaction.transactionIndex = rawTx.transactionIndex === null ? 0 : rawTx.transactionIndex;
    transaction.senderAddress = rawTx.from;
    transaction.toAddress = rawTx.to;
    transaction.value = new BigNumber(rawTx.value);
    transaction.gasPrice = rawTx.gasPrice || new BigNumber(0);
    transaction.gas = new BigNumber(rawTx.gas);
    transaction.input = rawTx.input;
    transaction.type = rawTx.type || 0;
    transaction.maxFeePerGas = rawTx.maxFeePerGas === undefined ? null : new BigNumber(rawTx.maxFeePerGas);
    transaction.maxPriorityFeePerGas =
        rawTx.maxPriorityFeePerGas === undefined ? null : new BigNumber(rawTx.maxPriorityFeePerGas);

    if (transaction.input.includes(ZEROEX_API_AFFILIATE_SELECTOR)) {
        const bytesPos = rawTx.input.indexOf(ZEROEX_API_AFFILIATE_SELECTOR);
        transaction.affiliateAddress = '0x'.concat(rawTx.input.slice(bytesPos + 32, bytesPos + 72));
        const quoteId = rawTx.input.slice(bytesPos + 104, bytesPos + 136);
        if (quoteId.slice(0, 14) === '00000000000000') {
            // Pre ZID QR ID
            const parsedQuoteTimestamp = parseInt(rawTx.input.slice(bytesPos + 128, bytesPos + 136), 16);
            transaction.quoteTimestamp = isNaN(parsedQuoteTimestamp) ? null : parsedQuoteTimestamp;
            transaction.quoteId = rawTx.input.slice(bytesPos + 118, bytesPos + 128);
        } else {
            // ZID
            transaction.quoteTimestamp = null;
            transaction.quoteId = '0x' + quoteId;
        }
    } else if (transaction.input.includes('fbc019a7')) {
        const bytesPos = rawTx.input.indexOf('fbc019a7');
        transaction.affiliateAddress = '0x'.concat(rawTx.input.slice(bytesPos + 32, bytesPos + 72));
        transaction.quoteTimestamp = null;
    }

    return transaction;
}

/**
 * Converts a raw receipt into a TransactionReceipt entity
 * @param rawReceipt Raw transaction receipt returned from JSON RPC
 */
export function parseTransactionReceipt(rawReceipt: RawReceipt): TransactionReceipt {
    const transactionReceipt = new TransactionReceipt();

    transactionReceipt.observedTimestamp = new Date().getTime();
    transactionReceipt.transactionHash = rawReceipt.transactionHash === null ? '' : rawReceipt.transactionHash;
    transactionReceipt.blockHash = rawReceipt.blockHash === null ? '' : rawReceipt.blockHash;
    transactionReceipt.blockNumber = rawReceipt.blockNumber === null ? 0 : rawReceipt.blockNumber;
    transactionReceipt.transactionIndex = rawReceipt.transactionIndex === null ? 0 : rawReceipt.transactionIndex;
    transactionReceipt.senderAddress = rawReceipt.from;
    transactionReceipt.toAddress = rawReceipt.to;
    transactionReceipt.gasUsed = new BigNumber(rawReceipt.gasUsed);
    transactionReceipt.gasFeesL1 = rawReceipt.gasFeesL1 === undefined ? null : new BigNumber(rawReceipt.gasFeesL1);

    return transactionReceipt;
}

/**
 * Converts a raw receipt into a TransactionLogs entity
 * @param rawReceipt Raw transaction receipt returned from JSON RPC
 */
export function parseTransactionLogs(rawReceipt: RawReceipt): TransactionLogs {
    const transactionLogs = new TransactionLogs();

    transactionLogs.observedTimestamp = new Date().getTime();
    transactionLogs.transactionHash = rawReceipt.transactionHash === null ? '' : rawReceipt.transactionHash;
    transactionLogs.logs = JSON.stringify(rawReceipt.logs);
    transactionLogs.blockHash = rawReceipt.blockHash === null ? '' : rawReceipt.blockHash;
    transactionLogs.blockNumber = rawReceipt.blockNumber === null ? 0 : rawReceipt.blockNumber;

    return transactionLogs;
}

/**
 * Converts a raw block into a Block entity
 * @param rawBlock Raw block without transaction info returned from JSON RPC
 */
export function parseBlock(rawBlock: BlockWithoutTransactionData): Block {
    const parsedBlock = new Block();

    parsedBlock.observedTimestamp = new Date().getTime();
    parsedBlock.blockHash = rawBlock.hash === null ? '' : rawBlock.hash;
    parsedBlock.blockNumber = rawBlock.number === null ? 0 : rawBlock.number;
    parsedBlock.blockTimestamp = rawBlock.timestamp;
    parsedBlock.baseFeePerGas = rawBlock.baseFeePerGas;
    parsedBlock.gasUsed = rawBlock.gasUsed;
    parsedBlock.parentHash = rawBlock.parentHash;

    return parsedBlock;
}
