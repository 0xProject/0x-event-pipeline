import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';
import {
    Block
} from '../../entities';
import { 
   parseBlock
} from '../../parsers/web3/parse_web3_objects';
import { Web3Source } from '../../data_sources/web3';

import * as config from "../../../config/defaults.json";


export class PullAndSaveWeb3 {
    private readonly _web3source: Web3Source;
    constructor(web3Source: Web3Source) {
        this._web3source = web3Source;
    }

    public async getParseSaveBlocks(connection: Connection, latestBlockWithOffset: number): Promise<void> {
        const tableName = 'blocks';
        const startBlock = await this._getStartBlockAsync(connection, latestBlockWithOffset);
        const endBlock = Math.min(latestBlockWithOffset, startBlock + (config.maxBlocksToPull - 1));
        logUtils.log(`Grabbing blocks between ${startBlock} and ${endBlock}`);
        const rawBlocks = await this._web3source.getBatchBlockInfoForRangeAsync(startBlock, endBlock);
        const parsedBlocks = rawBlocks.map(rawBlock => parseBlock(rawBlock));
        
        logUtils.log(`saving ${parsedBlocks.length} blocks`);

        this._deleteOverlapAndSaveBlocksAsync<Block>(connection, parsedBlocks, startBlock, tableName);
    }

    private async _getStartBlockAsync(connection: Connection, latestBlockWithOffset: number): Promise<number> {
        const queryResult = await connection.query(
            `SELECT block_number FROM events.blocks ORDER BY block_number DESC LIMIT 1`,
        );
    
        const lastKnownBlock = queryResult[0] || {block_number: config.firstSearchBlock};

        return Math.min(Number(lastKnownBlock.block_number) + 1, latestBlockWithOffset - config.startBlockOffset);
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
