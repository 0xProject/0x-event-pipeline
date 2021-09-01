import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { numberToBigIntTransformer } from '../transformers/big_number';


// Event emitted when a staking pool's operator share is decreased.
@Entity({ name: 'operator_share_decreased_events'})
export class OperatorShareDecreasedEvent extends Event {
    // Unique Id of pool.
    @Column({ name: 'pool_id' })
    public poolId!: string;
    // How much delegated stake is weighted vs operator stake, in ppm.
    @Column({ name: 'old_operator_share', type: 'bigint', transformer: numberToBigIntTransformer })
    public oldOperatorShare!: number;
    // Minimum amount of stake required in a pool to collect rewards.
    @Column({ name: 'new_operator_share', type: 'bigint', transformer: numberToBigIntTransformer })
    public newOperatorShare!: number;
}
