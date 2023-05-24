import { ConnectionOptions } from 'typeorm';

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
    ExpiredRfqOrderEvent,
    FillEvent,
    LastBlockProcessed,
    LogTransferEvent,
    MakerStakingPoolSetEvent,
    MetaTransactionExecutedEvent,
    MoveStakeEvent,
    NativeFill,
    OneinchSwappedV3Event,
    OneinchSwappedV4Event,
    OpenOceanSwappedV1Event,
    OperatorShareDecreasedEvent,
    OtcOrderFilledEvent,
    ParamsSetEvent,
    ParaswapSwapped2V5Event,
    ParaswapSwappedV4Event,
    ParaswapSwappedV5Event,
    RewardsPaidEvent,
    SlingshotTradeEvent,
    StakeEvent,
    StakingPoolCreatedEvent,
    StakingPoolEarnedRewardsInEpochEvent,
    StakingPoolMetadata,
    StakingProxyDeployment,
    TimechainSwapV1Event,
    TokenMetadata,
    TokenRegistry,
    Transaction,
    TransactionExecutionEvent,
    TransactionLogs,
    TransactionReceipt,
    TransformedERC20Event,
    UniswapV2PairCreatedEvent,
    UniswapV2SyncEvent,
    UnstakeEvent,
    V4CancelEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
    OnchainGovernanceProposalCreatedEvent,
    OnchainGovernanceCallScheduledEvent,
} from './entities';

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
    ExpiredRfqOrderEvent,
    FillEvent,
    LastBlockProcessed,
    LogTransferEvent,
    MakerStakingPoolSetEvent,
    MetaTransactionExecutedEvent,
    MoveStakeEvent,
    NativeFill,
    OneinchSwappedV3Event,
    OneinchSwappedV4Event,
    OpenOceanSwappedV1Event,
    OperatorShareDecreasedEvent,
    OtcOrderFilledEvent,
    ParamsSetEvent,
    ParaswapSwapped2V5Event,
    ParaswapSwappedV4Event,
    ParaswapSwappedV5Event,
    RewardsPaidEvent,
    SlingshotTradeEvent,
    StakeEvent,
    StakingPoolCreatedEvent,
    StakingPoolEarnedRewardsInEpochEvent,
    StakingPoolMetadata,
    StakingProxyDeployment,
    TimechainSwapV1Event,
    TokenMetadata,
    TokenRegistry,
    Transaction,
    TransactionExecutionEvent,
    TransactionLogs,
    TransactionReceipt,
    TransformedERC20Event,
    UniswapV2PairCreatedEvent,
    UniswapV2SyncEvent,
    UnstakeEvent,
    V4CancelEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
    OnchainGovernanceProposalCreatedEvent,
    OnchainGovernanceCallScheduledEvent,
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
