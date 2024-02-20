import { CHAIN_ID, STAKING_POOLS_JSON_URL, STAKING_POOLS_METADATA_JSON_URL } from '../config';
import { StakingPoolRegistrySource } from '../data_sources/staking-pool-registry';
import { StakingPoolMetadata } from '../entities';
import { parsePools } from '../parsers/staking-pool-registry';
import { logger } from '../utils/logger';
import { SCRIPT_RUN_DURATION } from '../utils/metrics';
import { Connection } from 'typeorm';

const stakingPoolsUrl = STAKING_POOLS_JSON_URL;
const poolMetadataUrl = STAKING_POOLS_METADATA_JSON_URL;

const stakingPoolSource = new StakingPoolRegistrySource(stakingPoolsUrl, poolMetadataUrl, CHAIN_ID);

export class MetadataScraper {
    public async getParseSaveMetadataAsync(connection: Connection): Promise<void> {
        const end = SCRIPT_RUN_DURATION.startTimer({ script: 'metadata' });
        logger.info(`pulling metadata`);

        const stakingPools = await stakingPoolSource.getStakingPoolsAsync();
        const poolMetadata = await stakingPoolSource.getStakingPoolMetadata();

        const parsedPools = parsePools(stakingPools, poolMetadata);

        const repostiory = connection.getRepository(StakingPoolMetadata);

        logger.info('Saving metadata');
        await repostiory.save(parsedPools);
        const duration = end();
        logger.info(`finished updating metadata`);
        logger.info(`It took ${duration} seconds to complete`);
    }
}
