import { Web3Source } from '../../data_sources/web3';
import { BLOCK_FINALITY_THRESHOLD } from '../../config';
import { LastBlockProcessed } from '../../entities';

export async function calculateEndBlockAsync(web3Source: Web3Source): Promise<number> {
    const currentBlock = await web3Source.getBlockNumberAsync();
    return currentBlock - BLOCK_FINALITY_THRESHOLD;
}

export async function lastBlockProcessedAsync(eventName: string, endBlock: number): Promise<LastBlockProcessed> {
    const lastBlockProcessed = new LastBlockProcessed();
    lastBlockProcessed.eventName = eventName;
    lastBlockProcessed.lastProcessedBlockNumber = endBlock;
    lastBlockProcessed.processedTimestamp = new Date().getTime();
    return lastBlockProcessed;
}
