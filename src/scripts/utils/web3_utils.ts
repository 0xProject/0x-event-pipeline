import { BigNumber } from '@0x/utils';
import { hexToUtf8 } from 'web3-utils';
import { chunk, logger } from '../../utils';
import { Connection, InsertResult } from 'typeorm';
import { Block, TokenMetadata, Transaction, TransactionLogs, TransactionReceipt } from '../../entities';
import {
    parseBlock,
    parseTransaction,
    parseTransactionLogs,
    parseTransactionReceipt,
} from '../../parsers/web3/parse_web3_objects';
import { Web3Source } from '../../data_sources/events/web3';

import {
    FEAT_NFT,
    FIRST_SEARCH_BLOCK,
    MAX_BLOCKS_TO_PULL,
    MAX_TX_TO_PULL,
    SCHEMA,
    START_BLOCK_OFFSET,
} from '../../config';

import { ERC165_ERC1155_INTERFACE, ERC165_ERC721_INTERFACE, ERC165_SUPPORTS_INTERFACE_SELECTOR } from '../../constants';

import { Gauge } from 'prom-client';
import { SCAN_END_BLOCK, SCAN_RESULTS, SCAN_START_BLOCK } from '../../utils/metrics';

import { TokenMetadataSingleton } from '../../tokenMetadataSingleton';

export type TokenMetadataMap = {
    tokenA: string;
    tokenB: string;
} | null;

export type TxDetailsType = {
    parsedTxs: Transaction[];
    parsedReceipts: TransactionReceipt[];
    parsedTxLogs: TransactionLogs[];
};

export class TxDetails implements TxDetailsType {
    parsedTxs = [];
    parsedReceipts = [];
    parsedTxLogs = [];
}

export const MISSING_TRANSACTIONS = new Gauge({
    name: 'event_scraper_missing_transactions',
    help: 'The count of how many partial transactions are in the DB, but have been reorged out of the blockchain',
});
export class PullAndSaveWeb3 {
    private readonly _web3source: Web3Source;
    constructor(web3Source: Web3Source) {
        this._web3source = web3Source;
    }

    public async getParseSaveBlocks(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const tableName = 'blocks';
        const startBlock = await this._getStartBlockAsync(connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_PULL - 1));

        SCAN_START_BLOCK.labels({ type: 'blocks' }).set(startBlock);
        SCAN_END_BLOCK.labels({ type: 'blocks' }).set(endBlock);

        logger.info(`Grabbing blocks between ${startBlock} and ${endBlock}`);
        const rawBlocks = await this._web3source.getBatchBlockInfoForRangeAsync(startBlock, endBlock);
        logger.debug('rawBlocks:');
        rawBlocks.map((rawBlock) => logger.debug(rawBlock));

        const nullBlocks = rawBlocks.filter((block) => !block);

        if (nullBlocks.length > 0) {
            logger.error(
                `Received ${nullBlocks.length} null blocks. Will drop this batch and retry on the next attempt`,
            );
            SCAN_RESULTS.labels({ type: 'blocks' }).set(0);
        } else {
            const parsedBlocks = rawBlocks.map((rawBlock) => parseBlock(rawBlock));

            SCAN_RESULTS.labels({ type: 'blocks' }).set(parsedBlocks.length);
            logger.info(`saving ${parsedBlocks.length} blocks`);

            await this._deleteOverlapAndSaveBlocksAsync(connection, parsedBlocks, startBlock, endBlock, tableName);
        }
    }
    private async _getStartBlockAsync(connection: Connection, latestBlockWithOffset: number): Promise<number> {
        const queryResult = await connection.query(
            `SELECT block_number FROM ${SCHEMA}.blocks ORDER BY block_number DESC LIMIT 1`,
        );

        const lastKnownBlock = queryResult[0] || { block_number: FIRST_SEARCH_BLOCK };

        return Math.min(Number(lastKnownBlock.block_number) + 1, latestBlockWithOffset - START_BLOCK_OFFSET);
    }

    private async _getTxListToPullAsync(
        connection: Connection,
        beforeBlock: number,
        txTable: string,
    ): Promise<string[]> {
        const queryResult = await connection.query(
            `
SELECT DISTINCT
  transaction_hash
FROM (
  SELECT DISTINCT
    transaction_hash,
    block_number
  FROM (
    (
      SELECT DISTINCT
        fe.transaction_hash,
        fe.block_number
      FROM ${SCHEMA}.native_fills fe
      LEFT JOIN ${SCHEMA}.${txTable} tx ON tx.transaction_hash = fe.transaction_hash
      WHERE
        fe.block_number < ${beforeBlock} AND
        (
          -- tx info hasn't been pulled
          tx.transaction_hash IS NULL OR
          -- or tx where the block info has changed
          tx.block_hash <> fe.block_hash
        )
      ORDER BY 2
      LIMIT ${MAX_TX_TO_PULL}
    )
    UNION
    (
      SELECT DISTINCT
        terc20.transaction_hash,
        terc20.block_number
      FROM ${SCHEMA}.transformed_erc20_events terc20
      LEFT JOIN ${SCHEMA}.${txTable} tx ON tx.transaction_hash = terc20.transaction_hash
      WHERE
        terc20.block_number < ${beforeBlock} AND
        (
          -- tx info hasn't been pulled
          tx.transaction_hash IS NULL OR
          -- or tx where the block info has changed
          tx.block_hash <> terc20.block_hash
        )
      ORDER BY 2
      LIMIT ${MAX_TX_TO_PULL}
    )
    UNION
    (
      SELECT DISTINCT
        bte.transaction_hash,
        bte.block_number
      FROM ${SCHEMA}.erc20_bridge_transfer_events bte
      LEFT JOIN ${SCHEMA}.${txTable} tx ON tx.transaction_hash = bte.transaction_hash
      WHERE
        bte.block_number < ${beforeBlock} AND
        (
          -- tx info hasn't been pulled
          tx.transaction_hash IS NULL OR
          -- tx where the block info has changed
           tx.block_hash <> bte.block_hash
        ) AND
        direct_flag
      ORDER BY 2
      LIMIT ${MAX_TX_TO_PULL}
    )
    ` +
                (FEAT_NFT
                    ? `
    UNION
    (
      SELECT DISTINCT
        events.transaction_hash,
        events.block_number
      FROM ${SCHEMA}.erc721_order_filled_events events
      LEFT JOIN ${SCHEMA}.${txTable} tx ON
        events.transaction_hash = tx.transaction_hash AND
        events.block_number = tx.block_number
      WHERE
        events.block_number < ${beforeBlock} AND
        -- tx info hasn't been pulled
        tx.transaction_hash IS NULL
      ORDER BY 2
      LIMIT ${MAX_TX_TO_PULL}
    )
    UNION
    (
      SELECT DISTINCT
        events.transaction_hash,
        events.block_number
      FROM ${SCHEMA}.erc721_order_cancelled_events events
      LEFT JOIN ${SCHEMA}.${txTable} tx ON
        events.transaction_hash = tx.transaction_hash AND
        events.block_number = tx.block_number
      WHERE
        events.block_number < ${beforeBlock} AND
        -- tx info hasn't been pulled
        tx.transaction_hash IS NULL
      ORDER BY 2
      LIMIT ${MAX_TX_TO_PULL}
    )
    UNION
    (
      SELECT DISTINCT
        events.transaction_hash,
        events.block_number
      FROM ${SCHEMA}.erc721_order_presigned_events events
      LEFT JOIN ${SCHEMA}.${txTable} tx ON
        events.transaction_hash = tx.transaction_hash AND
        events.block_number = tx.block_number
      WHERE
        events.block_number < ${beforeBlock} AND
        -- tx info hasn't been pulled
        tx.transaction_hash IS NULL
      ORDER BY 2
      LIMIT ${MAX_TX_TO_PULL}
    )
    UNION
    (
      SELECT DISTINCT
        events.transaction_hash,
        events.block_number
      FROM ${SCHEMA}.erc1155_order_filled_events events
      LEFT JOIN ${SCHEMA}.${txTable} tx ON
        events.transaction_hash = tx.transaction_hash AND
        events.block_number = tx.block_number
      WHERE
        events.block_number < ${beforeBlock} AND
        -- tx info hasn't been pulled
        tx.transaction_hash IS NULL
      ORDER BY 2
      LIMIT ${MAX_TX_TO_PULL}
    )
    UNION
    (
      SELECT DISTINCT
        events.transaction_hash,
        events.block_number
      FROM ${SCHEMA}.erc1155_order_cancelled_events events
      LEFT JOIN ${SCHEMA}.${txTable} tx ON
        events.transaction_hash = tx.transaction_hash AND
        events.block_number = tx.block_number
      WHERE
        events.block_number < ${beforeBlock} AND
        -- tx info hasn't been pulled
        tx.transaction_hash IS NULL
      ORDER BY 2
      LIMIT ${MAX_TX_TO_PULL}
    )
    UNION
    (
      SELECT DISTINCT
        events.transaction_hash,
        events.block_number
      FROM ${SCHEMA}.erc1155_order_presigned_events events
      LEFT JOIN ${SCHEMA}.${txTable} tx ON
        events.transaction_hash = tx.transaction_hash AND
        events.block_number = tx.block_number
      WHERE
        events.block_number < ${beforeBlock} AND
        -- tx info hasn't been pulled
        tx.transaction_hash IS NULL
      ORDER BY 2
      LIMIT ${MAX_TX_TO_PULL}
    )`
                    : '') +
                `
  ) united
  ORDER BY 2
  LIMIT ${MAX_TX_TO_PULL}
) only_hash
;`,
        );

        const txList = queryResult.map((e: { transaction_hash: string }) => e.transaction_hash);

        return txList;
    }

    private async _deleteOverlapAndSaveBlocksAsync(
        connection: Connection,
        toSave: Block[],
        startBlock: number,
        endBlock: number,
        tableName: string,
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            // delete events scraped prior to the most recent block range
            await queryRunner.manager.query(
                `DELETE FROM ${SCHEMA}.${tableName} WHERE block_number >= ${startBlock} AND block_number <= ${endBlock}`,
            );
            for (const chunkItems of chunk(toSave, 300)) {
                await queryRunner.manager.insert(Block, chunkItems);
            }

            // commit transaction now:
            await queryRunner.commitTransaction();
        } catch (err) {
            logger.error(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    private async _saveTransactionInfo(connection: Connection, transactions: Transaction[]): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        const txHashes = transactions.map((e) => e.transactionHash);
        const txHashList = txHashes.map((e) => `'${e}'`).toString();

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.query(
                `DELETE FROM ${SCHEMA}.transactions WHERE transaction_hash IN (${txHashList})`,
            );

            for (const chunkItems of chunk(transactions, 300)) {
                await queryRunner.manager.insert(Transaction, chunkItems);
            }

            // commit transaction now:
            await queryRunner.commitTransaction();
        } catch (err) {
            logger.error(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    private async _saveTransactionReceiptInfo(
        connection: Connection,
        txReceipts: TransactionReceipt[],
        txLogs: TransactionLogs[],
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        const txReceiptsHashes = txReceipts.map((e) => e.transactionHash);
        const txReceiptsHashList = txReceiptsHashes.map((e) => `'${e}'`).toString();

        const txLogsHashes = txLogs.map((e) => e.transactionHash);
        const txLogsHashList = txLogsHashes.map((e) => `'${e}'`).toString();

        logger.debug('Receipts:');
        logger.debug(txReceiptsHashes);
        logger.debug('Logs:');
        logger.debug(txLogsHashes);

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            let query = '';
            if (txReceiptsHashList.length > 0) {
                query =
                    query +
                    `DELETE FROM ${SCHEMA}.transaction_receipts WHERE transaction_hash IN (${txReceiptsHashList});`;
            }
            if (txLogsHashList.length > 0) {
                query = query + `DELETE FROM ${SCHEMA}.transaction_logs WHERE transaction_hash IN (${txLogsHashList});`;
            }
            await queryRunner.manager.query(query);
            logger.debug('DELETES probably went well');

            const promises: Promise<InsertResult>[] = [];

            if (txReceiptsHashList.length > 0) {
                for (const chunkItems of chunk(txReceipts, 300)) {
                    promises.push(queryRunner.manager.insert(TransactionReceipt, chunkItems));
                }
            }
            if (txLogsHashList.length > 0) {
                for (const chunkItems of chunk(txLogs, 300)) {
                    promises.push(queryRunner.manager.insert(TransactionLogs, chunkItems));
                }
            }

            await Promise.all([promises]);
            // commit transaction now:
            await queryRunner.commitTransaction();
        } catch (err) {
            logger.error(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}

export function extractTokensFromLogs(logs: any, tokenMetadataMap: TokenMetadataMap) {
    if (tokenMetadataMap !== null) {
        const tokens: string[] = [];
        try {
            logs.map((log: any) => {
                tokens.push(log[tokenMetadataMap.tokenA]);
                tokens.push(log[tokenMetadataMap.tokenB]);
            });
        } catch (err) {
            logger.error(err);
            logger.error(logs);
        }
        return tokens;
    }
    return [];
}

export async function getParseSaveTokensAsync(
    connection: Connection,
    web3Source: Web3Source,
    tokens: string[],
): Promise<number> {
    const tokenMetadataSingleton = await TokenMetadataSingleton.getInstance(connection);
    const missingTokens = [
        ...new Set(tokenMetadataSingleton.removeExistingTokens(tokens).filter((token) => token !== null)),
    ];

    if (missingTokens.length > 0) {
        logger.debug('Tokens to scan:');
        logger.debug(missingTokens);

        const erc721Tokens = await _keepERC721Async(web3Source, missingTokens);
        const nonErc721Tokens = missingTokens.filter((token) => !erc721Tokens.includes(token));
        const erc1155Tokens = await _keepERC1155Async(web3Source, nonErc721Tokens);
        const erc20Tokens = nonErc721Tokens.filter((token) => !erc1155Tokens.includes(token));

        // ERC1155 does not officialy includes symbol nor name, but some implement it
        const tokenSymbolCalls = missingTokens.map((token) => {
            return {
                to: token,
                data: '0x95d89b41',
            };
        });

        const symbolsHex = await web3Source.callContractMethodsNullRevertAsync(tokenSymbolCalls);
        const symbols = symbolsHex.map((tokenSymbolHex) => {
            let tokenSymbol = '';
            try {
                tokenSymbol = parseHexString(tokenSymbolHex) || '';
            } catch {
                logger.error('Failed to parse token symbol');
            }
            if (tokenSymbol === '') {
                return null;
            }
            return tokenSymbol;
        });

        const erc721Symbols = symbols.filter((symbol, index) => erc721Tokens.includes(missingTokens[index]));
        const erc1155Symbols = symbols.filter((symbol, index) => erc1155Tokens.includes(missingTokens[index]));
        const erc20Symbols = symbols.filter((symbol, index) => erc20Tokens.includes(missingTokens[index]));

        const tokenNameCalls = missingTokens.map((token) => {
            return {
                to: token,
                data: '0x06fdde03',
            };
        });

        const namesHex = await web3Source.callContractMethodsNullRevertAsync(tokenNameCalls);
        const names = namesHex.map((tokenNameHex) => {
            let tokenName = '';
            try {
                tokenName = parseHexString(tokenNameHex) || '';
            } catch {
                logger.error('Failed to parse token name');
            }
            if (tokenName === '') {
                return null;
            }
            return tokenName;
        });

        const erc721Names = names.filter((symbol, index) => erc721Tokens.includes(missingTokens[index]));
        const erc1155Names = names.filter((symbol, index) => erc1155Tokens.includes(missingTokens[index]));
        const erc20Names = names.filter((symbol, index) => erc20Tokens.includes(missingTokens[index]));

        const tokenDecimalsCalls = erc20Tokens.map((token) => {
            return {
                to: token,
                data: '0x313ce567',
            };
        });

        const erc20DecimalsHex = await web3Source.callContractMethodsNullRevertAsync(tokenDecimalsCalls);
        const erc20Decimals = erc20DecimalsHex.map((tokenDecimalsHex) => {
            const tokenDecimals = new BigNumber(tokenDecimalsHex);
            // UNISWAP v1 LP tokens respond with a very high number
            if (tokenDecimals.isNaN() || tokenDecimals.gt(1000)) {
                return null;
            }
            return tokenDecimals;
        });
        const erc721TokenMetadata = erc721Tokens.map((address, index) => {
            return {
                address: address,
                type: 'ERC721',
                name: erc721Names[index],
                symbol: erc721Symbols[index],
                observedTimestamp: new Date().getTime(),
            } as TokenMetadata;
        });
        const erc1155TokenMetadata = erc1155Tokens.map((address, index) => {
            return {
                address: address,
                type: 'ERC1155',
                name: erc1155Names[index],
                symbol: erc1155Symbols[index],
                observedTimestamp: new Date().getTime(),
            } as TokenMetadata;
        });
        const erc20TokenMetadata = erc20Tokens.map((address, index) => {
            return {
                address: address,
                type: 'ERC20',
                name: erc20Names[index],
                symbol: erc20Symbols[index],
                decimals: erc20Decimals[index],
                observedTimestamp: new Date().getTime(),
            } as TokenMetadata;
        });

        const allTokens = [...erc20TokenMetadata, ...erc721TokenMetadata, ...erc1155TokenMetadata];
        await tokenMetadataSingleton.saveNewTokenMetadata(connection, allTokens);
        return allTokens.length;
    }
    return 0;
}

function parseHexString(hex: string): string | null {
    if (hex === null) {
        return null;
    }
    const parsed = hexToUtf8(hex);

    // Only keep ASCII printable chars
    return parsed.replace(/[^\x20-\x7E]+/g, '').trim();
}

async function _keepERC721Async(web3Source: Web3Source, tokenAddresses: string[]) {
    return _erc165Filter(web3Source, tokenAddresses, ERC165_ERC721_INTERFACE);
}

async function _keepERC1155Async(web3Source: Web3Source, tokenAddresses: string[]) {
    return _erc165Filter(web3Source, tokenAddresses, ERC165_ERC1155_INTERFACE);
}

async function _erc165Filter(web3Source: Web3Source, tokenAddresses: string[], erc165_interface: string) {
    const checks = tokenAddresses.map((token) => {
        return {
            to: token,
            data: `0x${ERC165_SUPPORTS_INTERFACE_SELECTOR}${erc165_interface}`.padEnd(74, '0'),
        };
    });
    const responses = await web3Source.callContractMethodsNullRevertAsync(checks);

    const keptTokens = tokenAddresses
        .map((token, i) => {
            if (responses[i] === '0x0000000000000000000000000000000000000000000000000000000000000001') {
                return token;
            }
            return null;
        })
        .filter((token) => token);

    return keptTokens;
}

export async function getParseTxsAsync(
    connection: Connection,
    web3Source: Web3Source,
    hashes: string[],
): Promise<TxDetailsType> {
    logger.debug(`Grabbing transaction data`);

    const dedupedHashes = [...new Set(hashes)];

    logger.debug('Hashes to scan:');
    logger.debug(dedupedHashes);

    const rawTx = await web3Source.getBatchTxInfoAsync(dedupedHashes);
    const rawTxReceipts = await web3Source.getBatchTxReceiptInfoAsync(dedupedHashes);

    const foundTxs = rawTx.filter((rawTxn) => rawTxn);

    const foundTxReceipts = rawTxReceipts.filter((rawTxReceipt) => rawTxReceipt);

    const parsedTxs = foundTxs.map((rawTxn) => parseTransaction(rawTxn));
    const parsedReceipts = foundTxReceipts.map((rawTxReceipt) => parseTransactionReceipt(rawTxReceipt));
    const parsedTxLogs = foundTxReceipts.map((rawTxReceipt) => parseTransactionLogs(rawTxReceipt));

    const foundHashes = foundTxReceipts.map((rawTxReceipt) => rawTxReceipt.transactionHash);
    const missingHashes = dedupedHashes.filter((hash) => !foundHashes.includes(hash));

    MISSING_TRANSACTIONS.set(missingHashes.length);
    if (missingHashes.length > 0) {
        logger.warn(`Missing hashes: ${missingHashes}`);
    }

    logger.debug(`got ${parsedReceipts.length} txs`);

    return { parsedTxs, parsedReceipts, parsedTxLogs };
}

export async function getParseSaveTxAsync(
    connection: Connection,
    web3Source: Web3Source,
    hashes: string[],
): Promise<void> {
    logger.info(`Searching for ${hashes.length} Transactions`);

    const txData = await getParseTxsAsync(connection, web3Source, hashes);

    const txHashList = txData.parsedTxs.map((tx) => `'${tx.transactionHash}'`).toString();
    const txDeleteQuery = `DELETE FROM ${SCHEMA}.transactions WHERE transaction_hash IN (${txHashList})`;
    const txReceiptDeleteQuery = `DELETE FROM ${SCHEMA}.transaction_receipts WHERE transaction_hash IN (${txHashList});`;
    const txLogsDeleteQuery = `DELETE FROM ${SCHEMA}.transaction_logs WHERE transaction_hash IN (${txHashList});`;
    if (txData.parsedTxs.length) {
        // delete the transactions for the fetched events
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        await queryRunner.manager.query(txDeleteQuery);
        await queryRunner.manager.query(txReceiptDeleteQuery);
        await queryRunner.manager.query(txLogsDeleteQuery);

        for (const chunkItems of chunk(txData.parsedTxs, 300)) {
            await queryRunner.manager.insert(Transaction, chunkItems);
        }
        for (const chunkItems of chunk(txData.parsedReceipts, 300)) {
            await queryRunner.manager.insert(TransactionReceipt, chunkItems);
        }
        for (const chunkItems of chunk(txData.parsedTxLogs, 300)) {
            await queryRunner.manager.insert(TransactionLogs, chunkItems);
        }

        await queryRunner.commitTransaction();
        queryRunner.release();
    }
    logger.info(`Saved ${txData.parsedTxs.length} Transactions`);
}
