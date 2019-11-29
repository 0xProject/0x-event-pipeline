import { logUtils } from '@0x/utils';
import { Connection } from 'typeorm';

import { StakingPoolRegistrySource } from '../data_sources/staking-pool-registry';
import { parsePools } from '../parsers/staking-pool-registry';
import { StakingPoolMetadata } from '../entities'

import { CHAIN_ID } from '../config';

const stakingPoolsUrl =
    'https://raw.githubusercontent.com/0xProject/0x-staking-pool-registry/master/staking_pools.json';
const poolMetadataUrl =
    'https://raw.githubusercontent.com/0xProject/0x-staking-pool-registry/master/pool_metadata.json';

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
