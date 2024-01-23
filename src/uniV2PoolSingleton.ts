import prisma from './client';
import { Prisma } from '@prisma/client';

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

    static async initInstance(): Promise<void> {
        if (!UniV2PoolSingleton.instance) {
            UniV2PoolSingleton.instance = new UniV2PoolSingleton();
            const newPools = await prisma.uniswapV2PairCreatedEvent.findMany();
            UniV2PoolSingleton.instance.addNewPools(newPools);
        }
    }

    static getInstance(): UniV2PoolSingleton {
        if (!UniV2PoolSingleton.instance) {
            throw Error('Must initialize Uni v2 Pool Singleton before use');
        }
        return UniV2PoolSingleton.instance;
    }

    addNewPools(newPools: Prisma.UniswapV2PairCreatedEventCreateInput[]) {
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
