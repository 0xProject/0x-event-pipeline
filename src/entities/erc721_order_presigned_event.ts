import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers';

@Entity({ name: 'erc721_order_presigned_events' })
export class Erc721OrderPresignedEvent extends Event {
    @Column({ name: 'is_sell', type: 'boolean' })
    public isSell!: boolean;
    @Column({ name: 'maker', type: 'varchar' })
    public maker!: string;
    @Column({ name: 'taker', type: 'varchar' })
    public taker!: string;
    @Column({ name: 'expiry', type: 'numeric', transformer: bigNumberTransformer })
    public expiry!: BigNumber;
    @Column({ name: 'nonce', type: 'numeric', transformer: bigNumberTransformer })
    public nonce!: BigNumber;
    @Column({ name: 'erc20_token', type: 'varchar' })
    public erc20Token!: string;
    @Column({ name: 'erc20_token_amount', type: 'numeric', transformer: bigNumberTransformer })
    public erc20TokenAmount!: BigNumber;
    @Column({ name: 'fees', type: 'varchar' })
    public fees!: string | null;
    @Column({ name: 'erc721_token', type: 'varchar' })
    public erc721Token!: string;
    @Column({ name: 'erc721_token_id', type: 'numeric', transformer: bigNumberTransformer })
    public erc721TokenId!: BigNumber | null;
    @Column({ name: 'erc721_token_properties', type: 'varchar' })
    public erc721TokenProperties!: string;
}
