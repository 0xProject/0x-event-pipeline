import { CHAIN_ID } from './config';
import { UniswapV2PairCreatedEvent } from './entities';
import { logger } from './utils';
import { Connection } from 'typeorm';

export class UniV2PoolSingleton {
    private static instance: UniV2PoolSingleton;
    private pools: Map<
        string,
        {
            token0: string;
            token1: string;
            protocol: string;
        }
    >;

    private constructor() {
        this.pools = new Map<
            string,
            {
                token0: string;
                token1: string;
                protocol: string;
            }
        >();
    }

    static async initInstance(connection: Connection): Promise<void> {
        if (!UniV2PoolSingleton.instance) {
            UniV2PoolSingleton.instance = new UniV2PoolSingleton();
            logger.info('Loading Uni V2 and clones Pools to memory');
            const newPools = await connection
                .getRepository(UniswapV2PairCreatedEvent)
                .createQueryBuilder('uniswap_v2_pair_created_events')
                .where('uniswap_v2_pair_created_events.chainId = :chainId', { chainId: CHAIN_ID.toString() })
                .getMany();
            UniV2PoolSingleton.instance.addNewPools(newPools);
        }
    }

    static getInstance(): UniV2PoolSingleton {
        if (!UniV2PoolSingleton.instance) {
            throw Error('Must initialize Uni v2 Pool Singleton before use');
        }
        return UniV2PoolSingleton.instance;
    }

    addNewPools(newPools: UniswapV2PairCreatedEvent[]) {
        newPools.forEach((pool) =>
            this.pools.set(pool.pair, {
                token0: pool.token0,
                token1: pool.token1,
                protocol: pool.protocol,
            }),
        );
    }

    getPool(address: string) {
        return this.pools.get(address);
    }
}
