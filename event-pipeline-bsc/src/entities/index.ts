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

@Entity({ name: 'blocks', schema: 'events_bsc' })
export class Block extends BlockTemplate {}

@Entity({ name: 'erc20_bridge_transfer_events', schema: 'events_bsc' })
export class ERC20BridgeTransferEvent extends ERC20BridgeTransferEventTemplate {}

@Entity({ name: 'expired_rfq_order_events', schema: 'events_bsc' })
export class ExpiredRfqOrderEvent extends ExpiredRfqOrderEventTemplate {}

@Entity({ name: 'last_block_processed', schema: 'events_bsc' })
export class LastBlockProcessed extends LastBlockProcessedTemplate {}

@Entity({ name: 'native_fills', schema: 'events_bsc' })
export class NativeFill extends NativeFillTemplate {}

@Entity({ name: 'params_set_events', schema: 'events_bsc' })
export class ParamsSetEvent extends ParamsSetEventTemplate {}

@Entity({ name: 'transaction_logs', schema: 'events_bsc' })
export class TransactionLogs extends TransactionLogsTemplate {}

@Entity({ name: 'transaction_receipts', schema: 'events_bsc' })
export class TransactionReceipt extends TransactionReceiptTemplate {}

@Entity({ name: 'transactions', schema: 'events_bsc' })
export class Transaction extends TransactionTemplate {}

@Entity({ name: 'transformed_erc20_events', schema: 'events_bsc' })
export class TransformedERC20Event extends TransformedERC20EventTemplate {}

@Entity({ name: 'v4_cancel_events', schema: 'events_bsc' })
export class V4CancelEvent extends V4CancelEventTemplate {}

@Entity({ name: 'v4_limit_order_filled_events', schema: 'events_bsc' })
export class V4LimitOrderFilledEvent extends V4LimitOrderFilledEventTemplate {}

@Entity({ name: 'v4_rfq_order_filled_events', schema: 'events_bsc' })
export class V4RfqOrderFilledEvent extends V4RfqOrderFilledEventTemplate {}
