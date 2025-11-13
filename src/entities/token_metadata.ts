import { numberToBigIntTransformer } from '../transformers';
import { BigNumber } from '@0x/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tokens_metadata' })
export class TokenMetadata {
    @Column({ name: 'observed_timestamp', type: 'bigint', transformer: numberToBigIntTransformer })
    public observedTimestamp!: number;
    @PrimaryColumn({ name: 'address', type: 'varchar' })
    public address!: string;
    @Column({ name: 'type', type: 'varchar' })
    public type!: 'ERC20' | 'ERC721' | 'ERC1155';
    @Column({ name: 'symbol', type: 'varchar' })
    public symbol!: string | null;
    @Column({ name: 'name', type: 'varchar' })
    public name!: string | null;
    @Column({ name: 'decimals', type: 'int', transformer: numberToBigIntTransformer })
    public decimals!: BigNumber | null;
    @Column({ name: 'permit_2612', type: 'boolean'})
    public permit2612!: boolean | null;
}
