import { logUtils } from '@0x/utils';
import { Connection, getRepository } from 'typeorm';
import {
    Block,
    Transaction
} from '../../entities';
import { 
   parseBlock, parseTransaction
} from '../../parsers/web3/parse_web3_objects';
import { Web3Source } from '../../data_sources/web3';

import { FIRST_SEARCH_BLOCK, MAX_BLOCKS_TO_PULL, START_BLOCK_OFFSET } from '../../config';


export class PullAndSaveWeb3 {
    private readonly _web3source: Web3Source;
    constructor(web3Source: Web3Source) {
        this._web3source = web3Source;
    }

    public async getParseSaveBlocks(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const tableName = 'blocks';
        const startBlock = await this._getStartBlockAsync(connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (MAX_BLOCKS_TO_PULL - 1));
        logUtils.log(`Grabbing blocks between ${startBlock} and ${endBlock}`);
        const rawBlocks = await this._web3source.getBatchBlockInfoForRangeAsync(startBlock, endBlock);
        const parsedBlocks = rawBlocks.map(rawBlock => parseBlock(rawBlock));
        
        logUtils.log(`saving ${parsedBlocks.length} blocks`);

        this._deleteOverlapAndSaveBlocksAsync<Block>(connection, parsedBlocks, startBlock, tableName);
    }

    public async getParseSaveTx(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        logUtils.log(`Grabbing transaction data`);
        const hashes = await this._getTxListToPullAsync(connection, latestBlockWithOffset);
        const rawTx = await this._web3source.getBatchTxInfoAsync(hashes);
        const parsedTx = rawTx.map(rawTx => parseTransaction(rawTx));
        
        logUtils.log(`saving ${parsedTx.length} tx`);

        const txRepo = getRepository(Transaction);
        txRepo.save(parsedTx);
    }

    private async _getStartBlockAsync(connection: Connection, latestBlockWithOffset: number): Promise<number> {
        const queryResult = await connection.query(
            `SELECT block_number FROM events.blocks ORDER BY block_number DESC LIMIT 1`,
        );
    
        const lastKnownBlock = queryResult[0] || {block_number: FIRST_SEARCH_BLOCK};

        return Math.min(Number(lastKnownBlock.block_number) + 1, latestBlockWithOffset - START_BLOCK_OFFSET);
    }

    private async _getTxListToPullAsync(connection: Connection, beforeBlock: number): Promise<string[]> {
        const queryResult = await connection.query(`
            SELECT DISTINCT
                transaction_hash
            FROM (
                SELECT DISTINCT
                    transaction_hash
                    , block_number
                FROM (
                    (SELECT DISTINCT
                        fe.transaction_hash
                        , fe.block_number
                    FROM events.fill_events fe
                    LEFT JOIN events.transactions tx ON tx.transaction_hash = fe.transaction_hash
                    WHERE
                        fe.block_number < ${beforeBlock}
                        AND (
                            -- tx info hasn't been pulled
                            tx.transaction_hash IS NULL
                        )
                    ORDER BY 2
                    LIMIT 100)

                    UNION

                    (SELECT DISTINCT
                        terc20.transaction_hash
                        , terc20.block_number
                    FROM events.transformed_erc20_events terc20
                    LEFT JOIN events.transactions tx ON tx.transaction_hash = terc20.transaction_hash
                    WHERE
                        terc20.block_number < ${beforeBlock}
                        AND (
                            -- tx info hasn't been pulled
                            tx.transaction_hash IS NULL
                        )
                    ORDER BY 2
                    LIMIT 100)
                ORDER BY 2
                LIMIT 100
            ) a
        ) b;
        `,
        );

        const txList = queryResult.map((e: {transaction_hash: string}) => e.transaction_hash);

        return txList;
    }


    private async _deleteOverlapAndSaveBlocksAsync<T>(
        connection: Connection,
        toSave: T[],
        startBlock: number,
        tableName: string,
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();
    
        await queryRunner.connect();
    
        await queryRunner.startTransaction();
        try {
            
            // delete events scraped prior to the most recent block range
            await queryRunner.manager.query(`DELETE FROM events.${tableName} WHERE block_number >= ${startBlock}`);
            await queryRunner.manager.save(toSave);
            
            // commit transaction now:
            await queryRunner.commitTransaction();
            
        } catch (err) {
            
            logUtils.log(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
            
        } finally {
            
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
