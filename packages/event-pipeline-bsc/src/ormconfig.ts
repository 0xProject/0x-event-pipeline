import { ConnectionOptions } from 'typeorm';

import { POSTGRES_URI, SHOULD_SYNCHRONIZE } from './config';

import {
    Block,
    Transaction,
    TransactionLogs,
    TransactionReceipt,
    ParamsSetEvent,
    LastBlockProcessed,
    TransformedERC20Event,
    NativeFill,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
    ExpiredRfqOrderEvent,
    V4CancelEvent
} from './entities';

const entities = [
    Block,
    Transaction,
    TransactionLogs,
    TransactionReceipt,
    ParamsSetEvent,
    LastBlockProcessed,
    TransformedERC20Event,
    NativeFill,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
    ExpiredRfqOrderEvent,
    V4CancelEvent
];

const config: ConnectionOptions = {
    type: 'postgres',
    url: POSTGRES_URI,
    synchronize: SHOULD_SYNCHRONIZE,
    logging: ['error'],
    entities,
    migrations: ['lib/migrations/*.js'],
    migrationsTableName: 'bsc_event_pipeline_migrations'
};

module.exports = config;
