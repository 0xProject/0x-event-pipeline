import { UniswapV3PoolCreatedEvent } from './entities';
import { logger } from './utils';
import { Connection } from 'typeorm';

export class UniV3PoolSingleton {
    private static instance: UniV3PoolSingleton;
    private pools: Map<
        string,
        {
            token0: string;
            token1: string;
        }
    >;

    private constructor() {
        this.pools = new Map<
            string,
            {
                token0: string;
                token1: string;
            }
        >();
    }

    static async initInstance(connection: Connection): Promise<void> {
        if (!UniV3PoolSingleton.instance) {
            UniV3PoolSingleton.instance = new UniV3PoolSingleton();
            logger.info('Loading Uni V3 Pools to memory');
            const newPools = await connection.getRepository(UniswapV3PoolCreatedEvent).find();
            UniV3PoolSingleton.instance.addNewPools(newPools);
        }
    }

    static getInstance(): UniV3PoolSingleton {
        if (!UniV3PoolSingleton.instance) {
            throw Error('Must initialize Uni v3 Pool Singleton before use');
        }
        return UniV3PoolSingleton.instance;
    }

    addNewPools(newPools: UniswapV3PoolCreatedEvent[]) {
        newPools.forEach((pool) =>
            this.pools.set(pool.pool, {
                token0: pool.token0,
                token1: pool.token1,
            }),
        );
    }

    getPool(address: string) {
        return this.pools.get(address);
    }
}
