import {
    Block as BlockTemplate,
    ERC20BridgeTransferEvent as ERC20BridgeTransferEventTemplate,
    ExpiredRfqOrderEvent as ExpiredRfqOrderEventTemplate,
    LastBlockProcessed as LastBlockProcessedTemplate,
    NativeFill as NativeFillTemplate,
    ParamsSetEvent as ParamsSetEventTemplate,
    TransactionLogs as TransactionLogsTemplate,
    TransactionReceipt as TransactionReceiptTemplate,
    Transaction as TransactionTemplate,
    TransformedERC20Event as TransformedERC20EventTemplate,
    V4CancelEvent as V4CancelEventTemplate,
    V4LimitOrderFilledEvent as V4LimitOrderFilledEventTemplate,
    V4RfqOrderFilledEvent as V4RfqOrderFilledEventTemplate,
} from '@0x/pipeline-utils';
import { Entity } from 'typeorm';

export { FillEvent } from './fill_event';
export { CancelEvent } from './cancel_event';
export { CancelUpToEvent } from './cancel_up_to_event';
export { StakeEvent } from './stake_event';
export { UnstakeEvent } from './unstake_event';
export { MoveStakeEvent } from './move_stake_event';
export { StakingPoolCreatedEvent } from './staking_pool_created_event';
export { StakingPoolEarnedRewardsInEpochEvent } from './staking_pool_earned_rewards_in_epoch_event';
export { MakerStakingPoolSetEvent } from './maker_staking_pool_set_event';
export { OperatorShareDecreasedEvent } from './operator_share_decreased_event';
export { EpochEndedEvent } from './epoch_ended_event';
export { StakingPoolMetadata } from './staking_pool_metadata';
export { CurrentEpochInfo } from './current_epoch_info';
export { EpochFinalizedEvent } from './epoch_finalized_event';
export { RewardsPaidEvent } from './rewards_paid_event';
export { StakingProxyDeployment } from './staking_proxy_deployment';
export { TransactionExecutionEvent } from './transaction_execution_event';
export { OtcOrderFilledEvent } from './otc_order_filled_event';

@Entity({ name: 'blocks', schema: 'events' })
export class Block extends BlockTemplate {}

@Entity({ name: 'erc20_bridge_transfer_events', schema: 'events' })
export class ERC20BridgeTransferEvent extends ERC20BridgeTransferEventTemplate {}

@Entity({ name: 'expired_rfq_order_events', schema: 'events' })
export class ExpiredRfqOrderEvent extends ExpiredRfqOrderEventTemplate {}

@Entity({ name: 'last_block_processed', schema: 'events' })
export class LastBlockProcessed extends LastBlockProcessedTemplate {}

@Entity({ name: 'native_fills', schema: 'events' })
export class NativeFill extends NativeFillTemplate {}

@Entity({ name: 'params_set_events', schema: 'events' })
export class ParamsSetEvent extends ParamsSetEventTemplate {}

@Entity({ name: 'transaction_logs', schema: 'events' })
export class TransactionLogs extends TransactionLogsTemplate {}

@Entity({ name: 'transaction_receipts', schema: 'events' })
export class TransactionReceipt extends TransactionReceiptTemplate {}

@Entity({ name: 'transactions', schema: 'events' })
export class Transaction extends TransactionTemplate {}

@Entity({ name: 'transformed_erc20_events', schema: 'events' })
export class TransformedERC20Event extends TransformedERC20EventTemplate {}

@Entity({ name: 'v4_cancel_events', schema: 'events' })
export class V4CancelEvent extends V4CancelEventTemplate {}

@Entity({ name: 'v4_limit_order_filled_events', schema: 'events' })
export class V4LimitOrderFilledEvent extends V4LimitOrderFilledEventTemplate {}

@Entity({ name: 'v4_rfq_order_filled_events', schema: 'events' })
export class V4RfqOrderFilledEvent extends V4RfqOrderFilledEventTemplate {}
