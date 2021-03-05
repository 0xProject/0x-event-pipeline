import { EXCHANGE_PROXY_ADDRESS } from '../../constants';
import { request, gql } from 'graphql-request';

export interface Token {
    decimals: string;
    id: string;
    name: string;
    symbol: string;
}

export interface Pair {
    id: string;
    token0: Token;
    token1: Token;
}

export interface Transaction {
    blockNumber: string;
    id: string;
    timestamp: string;
}

export interface Swap {
    amount0In: string;
    amount0Out: string;
    amount1In: string;
    amount1Out: string;
    amountUSD: string;
    id: string;
    logIndex: string;
    pair: Pair;
    sender: string;
    to: string;
    transaction: Transaction;
}

export interface TheGraphResponse {
    swaps: Swap[];
}

export class UniswapV2Source {

    public async getSwapEventsAsync(
        startTime: number,
        endTime: number,
        endpoint: string,
        limit: number = 100,
    ): Promise<Swap[]> {
        let numEntries = limit;
        let skip = 0;
        let swaps: Swap[] = [];
        while (numEntries === limit) {
            const resp = await this.swapRequestAsync(startTime, endTime, endpoint,limit, skip);
            const newSwaps = resp.swaps;
            numEntries = newSwaps.length;
            skip = skip + numEntries;

            swaps = swaps.concat(newSwaps);
        }

        return swaps;
    }

    private async swapRequestAsync(
        startTime: number,
        endTime: number,
        endpoint: string,
        limit: number,
        skip: number,
    ): Promise<TheGraphResponse> {
        const query = gql`{
            swaps (
                first: ${limit},
                skip: ${skip},
                where: {
                    sender: "${EXCHANGE_PROXY_ADDRESS}",
                    timestamp_gt: ${startTime},
                    timestamp_lte: ${endTime},
            }) {
              id
              transaction {
                id
                blockNumber
                timestamp
              }
              pair {
                id
                token0 {
                  id
                  symbol
                  name
                  decimals
                }
                token1 {
                  id
                  symbol
                  name
                  decimals
                }
              }
              sender
              amount0In
              amount1In
              amount0Out
              amount1Out
              to
              logIndex
              amountUSD
            }
          }`;

        const resp = await request(endpoint, query);
    
        return resp;
    }

}
