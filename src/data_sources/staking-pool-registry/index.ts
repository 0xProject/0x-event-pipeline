import { fetchAsync } from '@0x/utils';

export interface PoolMetadataResponse {
    name: string;
    bio?: string;
    verified: boolean;
    website_url?: string;
    logo_img?: string;
    location?: string;
}

export enum ChainId {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Kovan = 42,
    Ganache = 1337,
}

export interface Pools {
    [key: string]: string;
}

export interface MetadataResponse {
    [key: string]: PoolMetadataResponse;
}

export class StakingPoolRegistrySource {
    private readonly _stakingPoolsUrl: string;
    private readonly _poolMetadataUrl: string;
    private readonly _chainId: ChainId;

    constructor(stakingPoolsUrl: string, poolMetadataUrl: string, chainId: ChainId) {
        this._stakingPoolsUrl = stakingPoolsUrl;
        this._poolMetadataUrl = poolMetadataUrl;
        this._chainId = chainId;
    }

    public async getStakingPoolMetadata(): Promise<MetadataResponse> {
        const resp = await fetchAsync(this._poolMetadataUrl);

        const respJson: MetadataResponse = await resp.json();
        return respJson;
    }

    public async getStakingPoolsAsync(): Promise<Pools> {
        const resp = await fetchAsync(this._stakingPoolsUrl);

        const chainToPools: { [chainId: number]: Pools } = await resp.json();

        const stakingPools =  chainToPools[this._chainId];

        return stakingPools;
    }
}
