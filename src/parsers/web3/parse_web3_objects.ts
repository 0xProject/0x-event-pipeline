import { 
    Block,
} from '../../entities';
import { BlockWithoutTransactionData } from 'ethereum-types';

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
