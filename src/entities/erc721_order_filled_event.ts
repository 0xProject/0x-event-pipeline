import { bigNumberTransformer } from '../transformers';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'erc721_order_filled_events' })
export class Erc721OrderFilledEvent extends Event {
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
    @Column({ name: 'erc20_token_amount', type: 'numeric', transformer: bigNumberTransformer })
    public erc20TokenAmount!: BigNumber;
    @Column({ name: 'erc721_token', type: 'varchar' })
    public erc721Token!: string;
    @Column({ name: 'erc721_token_id', type: 'numeric', transformer: bigNumberTransformer })
    public erc721TokenId!: BigNumber;
    @Column({ name: 'matcher', type: 'varchar' })
    public matcher!: string;
}
