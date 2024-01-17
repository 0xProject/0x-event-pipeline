import { bigNumberTransformer } from '../transformers';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

// These events come directly from the Exchange contract and are fired whenever
// someone fills an order.
@Entity({ name: 'otc_order_filled_events' })
export class OtcOrderFilledEvent extends Event {
    // The order hash.
    @Column({ name: 'order_hash' })
    public orderHash!: string;
    // The address of the maker.
    @Column({ name: 'maker_address' })
    public makerAddress!: string;
    // The address of the taker (may be null).
    @Column({ name: 'taker_address' })
    public takerAddress!: string;
    // The address of the maker token.
    @Column({ name: 'maker_token_address', type: 'varchar', nullable: true })
    public makerTokenAddress!: string | null;
    // The address of the taker token.
    @Column({ name: 'taker_token_address', type: 'varchar', nullable: true })
    public takerTokenAddress!: string | null;
    // The amount of the maker asset which was filled.
    @Column({ name: 'maker_token_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public makerTokenFilledAmount!: BigNumber;
    // The amount of the taker asset which was filled.
    @Column({ name: 'taker_token_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public takerTokenFilledAmount!: BigNumber;
}
