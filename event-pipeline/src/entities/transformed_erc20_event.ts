import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../utils';

// These events are fired when someone uses the exchange proxy to trade
@Entity({ name: 'transformed_erc20_events', schema: 'events' })
export class TransformedERC20Event extends Event {
    // The address of the taker
    @Column({ name: 'taker', type: 'varchar' })
    public taker!: string;
    // The address of the input token
    @Column({ name: 'input_token', type: 'varchar' })
    public inputToken!: string;
    // The address of the output token
    @Column({ name: 'output_token', type: 'varchar' })
    public outputToken!: string;
    // The amount of the input token that was transfered into the EP
    @Column({ name: 'input_token_amount', type: 'numeric', transformer: bigNumberTransformer })
    public inputTokenAmount!: BigNumber;
    // The amount of the output token that was transfered back to the taker
    @Column({ name: 'output_token_amount', type: 'numeric', transformer: bigNumberTransformer })
    public outputTokenAmount!: BigNumber;
}
