import { ConnectionOptions } from 'typeorm';

import { POSTGRES_URI, SHOULD_SYNCHRONIZE } from './config';

import {
    Block,
    Transaction,
    FillEvent,
    StakeEvent,
    UnstakeEvent,
    MoveStakeEvent,
    StakingPoolCreatedEvent,
    StakingPoolEarnedRewardsInEpochEvent,
    MakerStakingPoolSetEvent,
    ParamsSetEvent,
    OperatorShareDecreasedEvent,
    EpochEndedEvent,
    StakingPoolMetadata,
    CurrentEpochInfo,
    LastBlockProcessed,
    EpochFinalizedEvent,
    RewardsPaidEvent,
    StakingProxyDeployment,
    ERC20BridgeTransferEvent,
    TransformedERC20Event,
} from './entities';

const entities = [
    Block,
    Transaction,
    FillEvent,
    StakeEvent,
    UnstakeEvent,
    MoveStakeEvent,
    StakingPoolCreatedEvent,
    StakingPoolEarnedRewardsInEpochEvent,
    MakerStakingPoolSetEvent,
    ParamsSetEvent,
    OperatorShareDecreasedEvent,
    EpochEndedEvent,
    StakingPoolMetadata,
    CurrentEpochInfo,
    LastBlockProcessed,
    EpochFinalizedEvent,
    RewardsPaidEvent,
    StakingProxyDeployment,
    ERC20BridgeTransferEvent,
    TransformedERC20Event,
];

const config: ConnectionOptions = {
    type: 'postgres',
    url: POSTGRES_URI,
    synchronize: SHOULD_SYNCHRONIZE,
    logging: ['error'],
    entities,
    migrations: ['lib/migrations/*.js'],
    migrationsTableName: 'event_pipeline_migrations'
};

module.exports = config;
