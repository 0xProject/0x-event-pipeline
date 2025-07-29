import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'token_registry', schema: 'api' })
export class TokenRegistry {
    @PrimaryColumn({ name: 'address', type: 'varchar', readonly: true })
    public address!: string;
    @PrimaryColumn({ name: 'chainId', type: 'varchar', readonly: true })
    public chainId!: string;
    @Column({ name: 'tokenListsRank', type: 'int', readonly: true })
    public tokenListsRank!: number;
}
