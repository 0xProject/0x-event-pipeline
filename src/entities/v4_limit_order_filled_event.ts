import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../utils';

// Emitted whenever a `LimitOrder` is filled.
@Entity({ name: 'v4_limit_order_filled_events', schema: 'events' })
export class V4LimitOrderFilledEvent extends Event {

    @Column({ name: 'order_hash', type: 'varchar' })
    public orderHash!: string;
    @Column({ name: 'maker', type: 'varchar' })
    public maker!: string;
    @Column({ name: 'taker', type: 'varchar' })
    public taker!: string;
    @Column({ name: 'fee_recipient', type: 'varchar' })
    public feeRecipient!: string;
    @Column({ name: 'maker_token', type: 'varchar' })
    public makerToken!: string;
    @Column({ name: 'taker_token', type: 'varchar' })
    public takerToken!: string;
    @Column({ name: 'taker_token_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public takerTokenFilledAmount!: BigNumber;
    @Column({ name: 'maker_token_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public makerTokenFilledAmount!: BigNumber;
    @Column({ name: 'taker_token_fee_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public takerTokenFeeFilledAmount!: BigNumber;
    @Column({ name: 'protocol_fee_paid', type: 'numeric', transformer: bigNumberTransformer })
    public protocolFeePaid!: BigNumber;
    @Column({ name: 'pool', type: 'varchar' })
    public pool!: string;

}
