import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../utils';

// Emitted whenever an `RfqOrder` is filled.
@Entity({ name: 'rfq_order_filled_events', schema: 'events' })
export class RfqOrderFilledEvent extends Event {

    @Column({ name: 'order_hash' })
    public orderHash!: string;

    @Column({ name: 'maker', type: 'varchar' })
    public maker!: string;
    @Column({ name: 'taker', type: 'varchar' })
    public taker!: string;

    @Column({ name: 'maker_token', type: 'varchar' })
    public makerToken!: string;
    @Column({ name: 'taker_token', type: 'varchar' })
    public takerToken!: string;

    @Column({ name: 'taker_token_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public takerTokenFilledAmount!: BigNumber;
    @Column({ name: 'maker_token_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public makerTokenFilledAmount!: BigNumber;

    @Column({ name: 'pool' })
    public pool!: string;

    // TODO: decide if needs to add flags

    // @Column({ name: 'direct_flag', type: 'boolean', nullable: true })
    // public directFlag!: boolean | null;
    // @Column({ name: 'direct_protocol', type: 'varchar', nullable: true })
    // public directProtocol!: string | null;
}
