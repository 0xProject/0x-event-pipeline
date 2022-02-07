import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers';

@Entity({ name: 'erc1155_order_filled_events' })
export class Erc1155OrderFilledEvent extends Event {
    @Column({ name: 'is_sell', type: 'boolean' })
    public isSell!: boolean;
    @Column({ name: 'maker', type: 'varchar' })
    public maker!: string;
    @Column({ name: 'taker', type: 'varchar' })
    public taker!: string;
    @Column({ name: 'nonce', type: 'numeric', transformer: bigNumberTransformer })
    public nonce!: BigNumber;
    @Column({ name: 'erc20_token', type: 'varchar' })
    public erc20Token!: string;
    @Column({ name: 'erc20_fill_amount', type: 'numeric', transformer: bigNumberTransformer })
    public erc20FillAmount!: BigNumber;
    @Column({ name: 'erc1155_token', type: 'varchar' })
    public erc1155Token!: string;
    @Column({ name: 'erc1155_token_id', type: 'numeric', transformer: bigNumberTransformer })
    public erc1155TokenId!: BigNumber;
    @Column({ name: 'erc1155_fill_amount', type: 'numeric', transformer: bigNumberTransformer })
    public erc1155FillAmount!: BigNumber;
    @Column({ name: 'matcher', type: 'varchar' })
    public matcher!: string;
}
