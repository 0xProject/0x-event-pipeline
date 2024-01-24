import { CHAIN_ID, CHAIN_NAME_LOWER } from './config';
import { TokenMetadata, TokenRegistry } from './entities';
import { kafkaSendAsync } from './utils';
import { logger } from './utils';
import { SAVED_RESULTS } from './utils/metrics';
import { Producer } from 'kafkajs';
import { Connection } from 'typeorm';

const MAX_INITIAL_TOKENS = 10000;

export class TokenMetadataSingleton {
    private static instance: TokenMetadataSingleton;
    private tokens: string[];

    private constructor() {
        this.tokens = [];
    }

    static async getInstance(connection: Connection, producer: Producer | null): Promise<TokenMetadataSingleton> {
        if (!TokenMetadataSingleton.instance) {
            TokenMetadataSingleton.instance = new TokenMetadataSingleton();
            logger.info(`Loading the top ${MAX_INITIAL_TOKENS} tokens to memory`);
            const tmp = await connection
                .getRepository(TokenMetadata)
                .createQueryBuilder('token_metadata')
                .leftJoinAndSelect(TokenRegistry, 'token_registry', 'token_metadata.address = token_registry.address')
                .select([
                    'token_metadata.address',
                    'token_metadata.type',
                    'token_metadata.symbol',
                    'token_metadata.name',
                    'token_metadata.decimals',
                ])
                .where('token_registry.chainId = :chainId', { chainId: CHAIN_ID.toString() })
                .orderBy('token_registry.tokenListsRank', 'DESC')
                .limit(MAX_INITIAL_TOKENS) // Do not get all tokens, they don't fit in memory
                .getMany();
            TokenMetadataSingleton.instance.tokens = tmp.map((token) => token.address);
            kafkaSendAsync(producer, `event-scraper.${CHAIN_NAME_LOWER}.tokens-metadata.v1`, ['address'], tmp);
        }
        return TokenMetadataSingleton.instance;
    }
    removeExistingTokens(inputTokens: string[]): string[] {
        return inputTokens.filter((token) => token !== null && !this.tokens.includes(token.toLowerCase()));
    }

    async saveNewTokenMetadata(
        connection: Connection,
        producer: Producer | null,
        newTokenMetadata: TokenMetadata[],
    ): Promise<void> {
        await connection
            .getRepository(TokenMetadata)
            .createQueryBuilder('token_metadata')
            .insert()
            .into(TokenMetadata)
            .values(newTokenMetadata)
            .orIgnore() // "ON CONFLICT DO NOTHING"
            .execute();

        this.tokens = this.tokens.concat(newTokenMetadata.map((token) => token.address));

        // Does not exclude "ignored" tokens
        SAVED_RESULTS.labels({ type: 'tokens' }).inc(newTokenMetadata.length);
        kafkaSendAsync(producer, `event-scraper.${CHAIN_NAME_LOWER}.tokens-metadata.v0`, ['address'], newTokenMetadata);
    }
}
