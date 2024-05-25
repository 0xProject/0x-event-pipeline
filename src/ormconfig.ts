import { CHAIN_NAME, POSTGRES_URI, SCHEMA, SHOULD_SYNCHRONIZE } from './config';
import {
    Block,
    CancelEvent,
    CancelUpToEvent,
    CurrentEpochInfo,
    ERC20BridgeTransferEvent,
    EpochEndedEvent,
    EpochFinalizedEvent,
    Erc1155OrderCancelledEvent,
    Erc1155OrderFilledEvent,
    Erc1155OrderPresignedEvent,
    Erc721OrderCancelledEvent,
    Erc721OrderFilledEvent,
    Erc721OrderPresignedEvent,
    EventBackfill,
    ExpiredRfqOrderEvent,
    FillEvent,
    LastBlockProcessed,
    LogTransferEvent,
    MakerStakingPoolSetEvent,
    MetaTransactionExecutedEvent,
    MoveStakeEvent,
    NativeFill,
    OnchainGovernanceCallScheduledEvent,
    OnchainGovernanceProposalCreatedEvent,
    OperatorShareDecreasedEvent,
    OtcOrderFilledEvent,
    ParamsSetEvent,
    RewardsPaidEvent,
    SocketBridgeEvent,
    StakeEvent,
    StakingPoolCreatedEvent,
    StakingPoolEarnedRewardsInEpochEvent,
    StakingPoolMetadata,
    StakingProxyDeployment,
    TokenMetadata,
    TokenRegistry,
    Transaction,
    TransactionExecutionEvent,
    TransactionLogs,
    TransactionReceipt,
    TransformedERC20Event,
    UniswapV2PairCreatedEvent,
    UniswapV2SyncEvent,
    UniswapV3PoolCreatedEvent,
    UniswapV3SwapEvent,
    UnstakeEvent,
    UnwrapNativeEvent,
    V4CancelEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
    WrapNativeEvent,
    ERC20TransferEvent,
} from './entities';
import { ConnectionOptions } from 'typeorm';

const entities = [
    Block,
    CancelEvent,
    CancelUpToEvent,
    CurrentEpochInfo,
    ERC20BridgeTransferEvent,
    EpochEndedEvent,
    EpochFinalizedEvent,
    Erc1155OrderCancelledEvent,
    Erc1155OrderFilledEvent,
    Erc1155OrderPresignedEvent,
    Erc721OrderCancelledEvent,
    Erc721OrderFilledEvent,
    Erc721OrderPresignedEvent,
    EventBackfill,
    ExpiredRfqOrderEvent,
    FillEvent,
    LastBlockProcessed,
    LogTransferEvent,
    MakerStakingPoolSetEvent,
    MetaTransactionExecutedEvent,
    MoveStakeEvent,
    NativeFill,
    OnchainGovernanceCallScheduledEvent,
    OnchainGovernanceProposalCreatedEvent,
    OperatorShareDecreasedEvent,
    OtcOrderFilledEvent,
    ParamsSetEvent,
    RewardsPaidEvent,
    SocketBridgeEvent,
    StakeEvent,
    StakingPoolCreatedEvent,
    StakingPoolEarnedRewardsInEpochEvent,
    StakingPoolMetadata,
    StakingProxyDeployment,
    TokenMetadata,
    TokenRegistry,
    Transaction,
    TransactionExecutionEvent,
    TransactionLogs,
    TransactionReceipt,
    TransformedERC20Event,
    UniswapV2PairCreatedEvent,
    UniswapV2SyncEvent,
    UniswapV3PoolCreatedEvent,
    UniswapV3SwapEvent,
    UnstakeEvent,
    UnwrapNativeEvent,
    V4CancelEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
    WrapNativeEvent,
    ERC20TransferEvent,
];

const config: ConnectionOptions = {
    type: 'postgres',
    url: POSTGRES_URI,
    schema: SCHEMA,
    synchronize: SHOULD_SYNCHRONIZE,
    logging: ['error'],
    entities,
    migrations: [`lib/migrations/${CHAIN_NAME.toLowerCase()}/*.js`],
    migrationsTableName: 'evm_event_pipeline_migrations',
    applicationName: `event_pipeline_${CHAIN_NAME}`,
};

module.exports = config;
