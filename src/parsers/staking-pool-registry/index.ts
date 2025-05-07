import { CHAIN_ID } from '../../config';
import { BASE_GITHUB_LOGO_URL } from '../../config';
import { MetadataResponse, PoolMetadataResponse, Pools } from '../../data_sources/staking-pool-registry';
import { StakingPoolMetadata } from '../../entities';

// params
const baseGithubLogoUrl = BASE_GITHUB_LOGO_URL;

export function parsePools(rawPools: Pools, rawMetadata: MetadataResponse): StakingPoolMetadata[] {
    const parsedPools: StakingPoolMetadata[] = [];

    function pushIfDefined(poolId: string) {
        if (!(rawMetadata[rawPools[poolId]] === undefined)) {
            parsedPools.push(parseStakingPoolMetadata(rawMetadata[rawPools[poolId]], poolId));
        }
    }

    Object.keys(rawPools).forEach(pushIfDefined);

    return parsedPools;
}

function parseStakingPoolMetadata(poolMetadataResponse: PoolMetadataResponse, poolId: string): StakingPoolMetadata {
    const stakingPoolMetadata = new StakingPoolMetadata();
    stakingPoolMetadata.poolId = poolId;
    stakingPoolMetadata.name = poolMetadataResponse.name;
    stakingPoolMetadata.website =
        poolMetadataResponse.website_url === undefined ? null : poolMetadataResponse.website_url;
    stakingPoolMetadata.bio = poolMetadataResponse.bio === undefined ? null : poolMetadataResponse.bio;
    stakingPoolMetadata.location = poolMetadataResponse.location === undefined ? null : poolMetadataResponse.location;
    stakingPoolMetadata.logoUrl =
        poolMetadataResponse.logo_img === undefined ? null : baseGithubLogoUrl.concat(poolMetadataResponse.logo_img);
    stakingPoolMetadata.verified = poolMetadataResponse.verified;
    stakingPoolMetadata.chainId = CHAIN_ID.toString();

    return stakingPoolMetadata;
}
