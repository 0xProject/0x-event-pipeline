import { Connection } from 'typeorm';
import { TokenMetadata } from './entities';

export class TokenMetadataSingleton {
    private static instance: TokenMetadataSingleton;
    private tokens: string[];

    private constructor() {
        this.tokens = [];
    }

    static async getInstance(connection: Connection): Promise<TokenMetadataSingleton> {
        if (!TokenMetadataSingleton.instance) {
            TokenMetadataSingleton.instance = new TokenMetadataSingleton();
            const tmp = await connection
                .getRepository(TokenMetadata)
                .createQueryBuilder('token_metadata')
                .select('token_metadata.address')
                .getMany();
            TokenMetadataSingleton.instance.tokens = tmp.map((token) => token.address);
        }
        return TokenMetadataSingleton.instance;
    }
    removeExistingTokens(inputTokens: string[]): string[] {
        return inputTokens.filter((token) => token !== null && !this.tokens.includes(token.toLowerCase()));
    }

    async saveNewTokenMetadata(connection: Connection, newTokenMetadata: TokenMetadata[]): Promise<void> {
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.manager.upsert(TokenMetadata, newTokenMetadata, ['address']);
        await queryRunner.release();
        this.tokens = this.tokens.concat(newTokenMetadata.map((token) => token.address));
    }
}
