// load env vars
import { resolve } from 'path';
import { config } from 'dotenv';
config({ path: resolve(__dirname, '../../.env') });

import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Kafka, Producer } from 'kafkajs';
import * as ormConfig from './ormconfig';
import { logger } from './utils/logger';
import {
    CHAIN_ID,
    ENABLE_PROMETHEUS_METRICS,
    FEAT_TOKENS_FROM_TRANSFERS,
    FEAT_UNISWAP_V2_PAIR_CREATED_EVENT,
    KAFKA_AUTH_PASSWORD,
    KAFKA_AUTH_USER,
    KAFKA_BROKERS,
    KAFKA_SSL,
    SECONDS_BETWEEN_RUNS,
} from './config';

import { LegacyEventScraper } from './scripts/pull_and_save_legacy_events';
import { BackfillTxScraper } from './scripts/pull_and_save_backfill_tx';
import { BlockScraper } from './scripts/pull_and_save_blocks';
import { EventsByTopicScraper } from './scripts/pull_and_save_events_by_topic';
import { EventsBackfillScraper } from './scripts/backfill_events';
import { TokensFromTransfersScraper } from './scripts/pull_and_save_tokens_from_transfers';
import { TokensFromBackfill } from './scripts/pull_and_save_tokens_backfill';
import { ChainIdChecker } from './scripts/check_chain_id';
import { CurrentBlockMonitor } from './scripts/monitor_current_block';
import { startMetricsServer } from './utils/metrics';
import { TokenMetadataSingleton } from './tokenMetadataSingleton';
import { UniV2PoolSingleton } from './uniV2PoolSingleton';

const kafka = new Kafka({
    clientId: 'event-pipeline',
    brokers: KAFKA_BROKERS,
    ssl: KAFKA_SSL,
    sasl: KAFKA_SSL
        ? {
              mechanism: 'plain',
              username: KAFKA_AUTH_USER,
              password: KAFKA_AUTH_PASSWORD,
          }
        : undefined,
});

const producer = kafka.producer();

logger.info('App is running...');

const chainIdChecker = new ChainIdChecker();
const legacyEventScraper = new LegacyEventScraper();
const backfillTxScraper = new BackfillTxScraper();
const blockScraper = new BlockScraper();
const eventsByTopicScraper = new EventsByTopicScraper();
const eventsBackfillScraper = new EventsBackfillScraper();
const currentBlockMonitor = new CurrentBlockMonitor();
const tokensFromTransfersScraper = new TokensFromTransfersScraper();
const tokensFromBackfill = new TokensFromBackfill();

if (ENABLE_PROMETHEUS_METRICS) {
    startMetricsServer();
}

chainIdChecker.checkChainId(CHAIN_ID);

// run pull and save events
createConnection(ormConfig as ConnectionOptions)
    .then(async (connection) => {
        await producer.connect();
        await TokenMetadataSingleton.getInstance(connection, producer);
        if (FEAT_UNISWAP_V2_PAIR_CREATED_EVENT) {
            await UniV2PoolSingleton.initInstance(connection);
        }
        schedule(null, null, currentBlockMonitor.monitor, 'Current Block');
        schedule(connection, producer, blockScraper.getParseSaveEventsAsync, 'Pull and Save Blocks');
        schedule(connection, producer, eventsByTopicScraper.getParseSaveEventsAsync, 'Pull and Save Events by Topic');
        schedule(connection, producer, eventsBackfillScraper.getParseSaveEventsAsync, 'Backfill Events by Topic');
        schedule(
            connection,
            producer,
            backfillTxScraper.getParseSaveTxBackfillAsync,
            'Pull and Save Backfill Transactions',
        );
        if (CHAIN_ID === 1) {
            schedule(connection, null, legacyEventScraper.getParseSaveEventsAsync, 'Pull and Save Legacy Events');
        }
        if (FEAT_TOKENS_FROM_TRANSFERS) {
            schedule(
                connection,
                null,
                tokensFromTransfersScraper.getParseSaveTokensFromTransfersAsync,
                'Pull and Save Tokens',
            );
            schedule(
                connection,
                null,
                tokensFromBackfill.getParseSaveTokensFromBackfillAsync,
                'Pull and Save Backfill Tokens',
            );
        }
    })
    .catch((error) => logger.error(error));

async function schedule(connection: Connection | null, producer: Producer | null, func: any, funcName: string) {
    const start = new Date().getTime();
    await func(connection, producer);
    const end = new Date().getTime();
    const duration = end - start;
    let wait: number;
    if (duration > SECONDS_BETWEEN_RUNS * 1000) {
        wait = 0;
        logger.warn(`${funcName} is taking longer than desiered interval`);
    } else {
        wait = SECONDS_BETWEEN_RUNS * 1000 - duration;
    }
    setTimeout(() => {
        schedule(connection, producer, func, funcName);
    }, wait);
}
