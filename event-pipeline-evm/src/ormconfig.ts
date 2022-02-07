import { ConnectionOptions } from 'typeorm';

import { CHAIN_NAME, POSTGRES_URI, SCHEMA, SHOULD_SYNCHRONIZE } from './config';

import {
    Block,
    ERC20BridgeTransferEvent,
    Erc721OrderCancelledEvent,
    Erc721OrderFilledEvent,
    Erc721OrderPresignedEvent,
    ExpiredRfqOrderEvent,
    LastBlockProcessed,
    NativeFill,
    OneinchSwappedV3Event,
    OneinchSwappedV4Event,
    OpenOceanSwappedV1Event,
    OtcOrderFilledEvent,
    ParamsSetEvent,
    ParaswapSwappedV4Event,
    ParaswapSwappedV5Event,
    SlingshotTradeEvent,
    TimechainSwapV1Event,
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
    ERC20BridgeTransferEvent,
    Erc721OrderCancelledEvent,
    Erc721OrderFilledEvent,
    Erc721OrderPresignedEvent,
    ExpiredRfqOrderEvent,
    LastBlockProcessed,
    NativeFill,
    OneinchSwappedV3Event,
    OneinchSwappedV4Event,
    OpenOceanSwappedV1Event,
    OtcOrderFilledEvent,
    ParamsSetEvent,
    ParaswapSwappedV4Event,
    ParaswapSwappedV5Event,
    SlingshotTradeEvent,
    TimechainSwapV1Event,
    Transaction,
    TransactionLogs,
    TransactionReceipt,
    TransformedERC20Event,
    V4CancelEvent,
    V4LimitOrderFilledEvent,
    V4RfqOrderFilledEvent,
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
