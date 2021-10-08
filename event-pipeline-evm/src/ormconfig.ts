import { ConnectionOptions } from 'typeorm';

import { CHAIN_NAME, POSTGRES_URI, SCHEMA, SHOULD_SYNCHRONIZE } from './config';

import {
    Block,
    ERC20BridgeTransferEvent,
    ExpiredRfqOrderEvent,
    LastBlockProcessed,
    NativeFill,
    OneinchSwappedEvent,
    ParamsSetEvent,
    ParaswapSwappedV4Event,
    ParaswapSwappedV5Event,
    SlingshotTradeEvent,
    Transaction,
    TransactionLogs,
    TransactionReceipt,
    TransformedERC20Event,
    V4CancelEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
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
    OneinchSwappedEvent,
    ParaswapSwappedV4Event,
    ParaswapSwappedV5Event,
    SlingshotTradeEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
    ExpiredRfqOrderEvent,
    V4CancelEvent,
    ERC20BridgeTransferEvent,
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
