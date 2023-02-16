import { Connection } from 'typeorm';
import { RedisClientType } from 'redis';
import { TokenMetadata } from './entities';
import { chunk, logger } from './utils';
import { CHAIN_NAME } from './config';

export class TokenMetadataSingleton {
    private static instance: TokenMetadataSingleton;
    private redis: RedisClientType;

    private constructor(redis: RedisClientType) {
        this.redis = redis;
    }

    static async getInstance(connection: Connection): Promise<TokenMetadataSingleton | null> {
        if (!TokenMetadataSingleton.instance) {
            throw Error('Token Metadata Singleton was not initiated');
            return null;
        }

        const count = await connection.getRepository(TokenMetadata).count();
        console.log(count);
        const MAX_TOKENS_CHUNK = 10000;
        for (let i = 0; i < count; i = i + MAX_TOKENS_CHUNK) {
            const chunkedTokens = await connection
                .getRepository(TokenMetadata)
                .createQueryBuilder('token_metadata')
                .select('token_metadata.address')
                .offset(i)
                .limit(MAX_TOKENS_CHUNK)
                .getMany();
            await Promise.all(
                chunkedTokens.map((token) => this.instance.redis.set(`token:${CHAIN_NAME}:${token.address}`, 1)),
            );
        }

        return TokenMetadataSingleton.instance;
    }

    tokenExists(address: string) {
        this.instance;
    }
    removeExistingTokens(inputTokens: string[]): string[] {
        return inputTokens.filter((token) => !this.tokens.includes(token));
    }

    async saveNewTokenMetadata(connection: Connection, newTokenMetadata: TokenMetadata[]): Promise<void> {
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.manager.upsert(TokenMetadata, newTokenMetadata, ['address']);
        await queryRunner.release();

        await Promise.all(newTokenMetadata.map((token) => this.redis.set(`token:${CHAIN_NAME}:${token.address}`, 1)));
    }
}
