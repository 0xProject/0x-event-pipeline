import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';

import { StakingPoolRegistrySource } from '../data_sources/staking-pool-registry';
import { parsePools } from '../parsers/staking-pool-registry';
import { StakingPoolMetadata } from '../entities'

import { CHAIN_ID, STAKING_POOLS_JSON_URL, STAKING_POOLS_METADATA_JSON_URL } from '../config';

const stakingPoolsUrl = STAKING_POOLS_JSON_URL;
const poolMetadataUrl = STAKING_POOLS_METADATA_JSON_URL;

const stakingPoolSource = new StakingPoolRegistrySource(stakingPoolsUrl, poolMetadataUrl, CHAIN_ID);

export class MetadataScraper {
    public async getParseSaveMetadataAsync(connection: Connection): Promise<void> {
        logUtils.log(`pulling metadata`);

        const stakingPools = await stakingPoolSource.getStakingPoolsAsync();
        const poolMetadata = await stakingPoolSource.getStakingPoolMetadata();

        const parsedPools = parsePools(stakingPools, poolMetadata);

        const repostiory = connection.getRepository(StakingPoolMetadata);

        logUtils.log('Saving metadata');
        await repostiory.save(parsedPools);
        logUtils.log(`finished updating metadata`);
    };
};
