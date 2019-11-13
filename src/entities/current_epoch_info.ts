import { Column, Entity, PrimaryColumn } from 'typeorm';
import { numberToBigIntTransformer, bigNumberTransformer } from '../utils';
import { BigNumber } from '@0x/utils';

// Event emitted when a staking pool's operator share is decreased.
@Entity({ name: 'current_epoch_info', schema: 'events' })
export class CurrentEpochInfo {
    // ID of the current epoch
    @PrimaryColumn({ name: 'epoch_id', transformer: numberToBigIntTransformer })
    public poolId!: number;
    // Start time of the epoch (from block time)
    @Column({ name: 'start_time', transformer: numberToBigIntTransformer })
    public startTime!: number;
    // block number in which the epoch started
    @Column({ name: 'starting_block_number', transformer: numberToBigIntTransformer })
    public startingBlockNumber!: number;
    // hash of the transaction marking the start of the epoch
    @Column({ name: 'starting_transaction_hash' })
    public startingTransactionHash!: string;
    // index of the transaction marking the start of the epoch
    @Column({ name: 'starting_transaction_index', transformer: numberToBigIntTransformer })
    public startingTransactionIndex!: number;
    // total fees collected during the epoch (thus far)
    @Column({ name: 'total_fees_collected', type: 'numeric', transformer: bigNumberTransformer })
    public totalFeesCollected!: BigNumber;
    // Total ZRX staked up to the current time (to go into effect next epoch)
    @Column({ name: 'zrx_staked_for_next_epoch', type: 'numeric', transformer: bigNumberTransformer })
    public zrxStakedForNextEpoch!: BigNumber;
    // Relevant ZRX staked for this epoch
    @Column({ name: 'zrx_staked', type: 'numeric', transformer: bigNumberTransformer })
    public zrxStaked!: BigNumber;
}
