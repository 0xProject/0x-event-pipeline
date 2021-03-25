import { Connection } from 'typeorm';

import { UniswapPair } from '../../entities';

export class UniswapWatchedPairs {

    public async getUniswapWatchedPairs(
      connection: Connection
      ): Promise<UniswapPair[]> {

      const pairs = await connection.manager.find(UniswapPair);

      return pairs;
    }
}

