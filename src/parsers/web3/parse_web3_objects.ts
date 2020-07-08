import { BigNumber } from '@0x/utils';
import { 
    Block,
    Transaction
} from '../../entities';
import { BlockWithoutTransactionData, Transaction as RawTx } from 'ethereum-types';

/**
 * Converts a raw tx into a Transaction entity
 * @param rawTx Raw transaction returned from JSON RPC
 */
export function parseTransaction(rawTx: RawTx): Transaction {
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
    transaction.gasPrice = new BigNumber(rawTx.gasPrice);
    transaction.gas = new BigNumber(rawTx.gas);
    transaction.input = rawTx.input;

    if(transaction.input.includes('869584cd')) {
        const bytesPos = rawTx.input.indexOf('869584cd');
        transaction.affiliateAddress = '0x'.concat(rawTx.input.slice(bytesPos+32,bytesPos+72));
        transaction.quoteTimestamp = parseInt(rawTx.input.slice(bytesPos+128,bytesPos+136),16);
    } else if(transaction.input.includes('fbc019a7')) {
        const bytesPos = rawTx.input.indexOf('fbc019a7');
        transaction.affiliateAddress = '0x'.concat(rawTx.input.slice(bytesPos+32,bytesPos+72));
        transaction.quoteTimestamp = null;
    }

    return transaction;
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

    return parsedBlock;
}
