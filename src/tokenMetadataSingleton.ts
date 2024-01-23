import { CHAIN_NAME_LOWER } from './config';
import { kafkaSendAsync } from './utils';
import { SAVED_RESULTS } from './utils/metrics';
import { Producer } from 'kafkajs';
import prisma from './client';
import { Prisma, PrismaClient } from '@prisma/client';

export class TokenMetadataSingleton {
    private static instance: TokenMetadataSingleton;
    private tokens: string[];

    private constructor() {
        this.tokens = [];
    }

    static async getInstance(producer: Producer | null): Promise<TokenMetadataSingleton> {
        if (!TokenMetadataSingleton.instance) {
            TokenMetadataSingleton.instance = new TokenMetadataSingleton();
            const tmp = await prisma.tokenMetadata.findMany({
                take: 10000, // Do not get all tokens, they don't fit in memory
            });
            TokenMetadataSingleton.instance.tokens = tmp.map((token) => token.address);
            kafkaSendAsync(producer, `event-scraper.${CHAIN_NAME_LOWER}.tokens-metadata.v1`, ['address'], tmp);
        }
        return TokenMetadataSingleton.instance;
    }
    removeExistingTokens(inputTokens: string[]): string[] {
        return inputTokens.filter((token) => token !== null && !this.tokens.includes(token.toLowerCase()));
    }

    async saveNewTokenMetadata(
        prisma: PrismaClient,
        producer: Producer | null,
        newTokenMetadata: Prisma.TokenMetadataCreateInput[],
    ): Promise<void> {
        await prisma.tokenMetadata.createMany({ data: newTokenMetadata, skipDuplicates: true });
        this.tokens = this.tokens.concat(newTokenMetadata.map((token) => token.address));

        // Does not exclude "ignored" tokens
        SAVED_RESULTS.labels({ type: 'tokens' }).inc(newTokenMetadata.length);
        kafkaSendAsync(producer, `event-scraper.${CHAIN_NAME_LOWER}.tokens-metadata.v0`, ['address'], newTokenMetadata);
    }
}
