import { ConnectionOptions } from 'typeorm';

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
];

const config: ConnectionOptions = {
    type: 'postgres',
    url: process.env.CONNECTION_STRING,
    synchronize: false,
    logging: ['error'],
    entities,
    migrations: ['lib/migrations/*.js'],
    migrationsTableName: 'event_pipeline_migrations'
};

module.exports = config;
