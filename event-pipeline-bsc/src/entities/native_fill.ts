import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../utils';

// Emitted whenever a `LimitOrder` or `RfqOrder` is filled.
@Entity({ name: 'native_fills', schema: 'events_bsc' })
export class NativeFill extends Event {

    @Column({ name: 'order_hash' })
    public orderHash!: string;
    @Column({ name: 'maker', type: 'varchar' })
    public maker!: string;
    @Column({ name: 'taker', type: 'varchar' })
    public taker!: string;
    @Column({ name: 'fee_recipient', type: 'varchar', nullable: true })
    public feeRecipient!: string | null;
    @Column({ name: 'maker_token', type: 'varchar', nullable: true })
    public makerToken!: string | null;
    @Column({ name: 'taker_token', type: 'varchar', nullable: true })
    public takerToken!: string | null;
    @Column({ name: 'taker_token_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public takerTokenFilledAmount!: BigNumber;
    @Column({ name: 'maker_token_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public makerTokenFilledAmount!: BigNumber;
    @Column({ name: 'taker_fee_paid', type: 'numeric', transformer: bigNumberTransformer, nullable: true })
    public takerFeePaid!: BigNumber | null;
    @Column({ name: 'maker_fee_paid', type: 'numeric', transformer: bigNumberTransformer, nullable: true })
    public makerFeePaid!: BigNumber | null;
    @Column({ name: 'maker_proxy_type', type: 'varchar', nullable: true })
    public makerProxyType!: string | null;
    @Column({ name: 'maker_fee_token', type: 'varchar', nullable: true })
    public makerFeeToken!: string | null;
    @Column({ name: 'taker_proxy_type', type: 'varchar', nullable: true })
    public takerProxyType!: string | null;
    @Column({ name: 'taker_fee_token', type: 'varchar', nullable: true })
    public takerFeeToken!: string | null;
    @Column({ name: 'protocol_fee_paid', type: 'numeric', transformer: bigNumberTransformer, nullable: true })
    public protocolFeePaid!: BigNumber | null;
    @Column({ name: 'pool', nullable: true, type: 'varchar' })
    public pool!: string | null;
    @Column({ name: 'protocol_version', type: 'varchar' })
    public protocolVersion!: string;
    @Column({ name: 'native_order_type', type: 'varchar', nullable: true })
    public nativeOrderType!: string | null;
}
