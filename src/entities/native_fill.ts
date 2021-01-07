import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../utils';

// Emitted whenever a `LimitOrder` or `RfqOrder` is filled.
@Entity({ name: 'native_fills', schema: 'events' })
export class NativeFill extends Event {

    @Column({ name: 'order_hash' })
    public orderHash!: string;

    @Column({ name: 'maker', type: 'varchar' })
    public maker!: string;
    @Column({ name: 'taker', type: 'varchar' })
    public taker!: string;
    @Column({ name: 'fee_recipient', type: 'varchar', nullable: true })
    public feeRecipient!: string | null;

    @Column({ name: 'maker_token', type: 'varchar' })
    public makerToken!: string;
    @Column({ name: 'taker_token', type: 'varchar' })
    public takerToken!: string;

    @Column({ name: 'taker_token_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public takerTokenFilledAmount!: BigNumber;
    @Column({ name: 'maker_token_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public makerTokenFilledAmount!: BigNumber;
    @Column({ name: 'taker_token_fee_filled_amount', type: 'numeric', transformer: bigNumberTransformer, nullable: true })
    public takerTokenFeeFilledAmount!: BigNumber | null;

    @Column({ name: 'protocol_fee_paid', type: 'numeric', transformer: bigNumberTransformer })
    public protocolFeePaid!: BigNumber;

    @Column({ name: 'pool' })
    public pool!: string;

    // TODO: decide if needs to add flags

    @Column({ name: 'native_order_flag', type: 'varchar', nullable: true })
    public nativeOrderFlag!: string | null;
}
