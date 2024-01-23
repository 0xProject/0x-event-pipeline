import {
    CHAIN_ID,
    ENABLE_PROMETHEUS_METRICS,
    FEAT_TOKENS_FROM_TRANSFERS,
    FEAT_UNISWAP_V2_PAIR_CREATED_EVENT,
    FEAT_UNISWAP_V3_POOL_CREATED_EVENT,
    KAFKA_AUTH_PASSWORD,
    KAFKA_AUTH_USER,
    KAFKA_BROKERS,
    KAFKA_SSL,
    SCRAPER_MODE,
    SECONDS_BETWEEN_RUNS,
} from './config.ts';
import { EventsBackfillScraper } from './scripts/backfill_events.ts';
import { ChainIdChecker } from './scripts/check_chain_id.ts';
import { CurrentBlockMonitor } from './scripts/monitor_current_block.ts';
import { BackfillTxScraper } from './scripts/pull_and_save_backfill_tx.ts';
import { BlockEventsScraper } from './scripts/pull_and_save_block_events.ts';
import { BlockScraper } from './scripts/pull_and_save_blocks.ts';
import { EventsByTopicScraper } from './scripts/pull_and_save_events_by_topic.ts';
import { TokensFromBackfill } from './scripts/pull_and_save_tokens_backfill.ts';
import { TokensFromTransfersScraper } from './scripts/pull_and_save_tokens_from_transfers.ts';
import { TokenMetadataSingleton } from './tokenMetadataSingleton.ts';
import { UniV2PoolSingleton } from './uniV2PoolSingleton.ts';
import { UniV3PoolSingleton } from './uniV3PoolSingleton.ts';
import { logger } from './utils/logger.ts';
import { startMetricsServer } from './utils/metrics.ts';
import { config } from 'dotenv';
import { Kafka, Producer } from 'kafkajs';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../.env') });

let producer: Producer | null = null;

if (KAFKA_BROKERS.length > 0) {
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

    producer = kafka.producer();
}

const chainIdChecker = new ChainIdChecker();
const blockEventsScraper = new BlockEventsScraper();
/*
const backfillTxScraper = new BackfillTxScraper();
const blockScraper = new BlockScraper();
const eventsByTopicScraper = new EventsByTopicScraper();
const eventsBackfillScraper = new EventsBackfillScraper();
const currentBlockMonitor = new CurrentBlockMonitor();
const tokensFromTransfersScraper = new TokensFromTransfersScraper();
const tokensFromBackfill = new TokensFromBackfill();
*/
if (ENABLE_PROMETHEUS_METRICS) {
    startMetricsServer();
}

(async () => {
    await chainIdChecker.checkChainId(CHAIN_ID);

    logger.info(`Running in ${SCRAPER_MODE} mode`);

    // run pull and save events
    if (producer) {
        await producer.connect();
    }

    await TokenMetadataSingleton.getInstance(producer);
    if (FEAT_UNISWAP_V2_PAIR_CREATED_EVENT) {
        await UniV2PoolSingleton.initInstance();
    }
    if (FEAT_UNISWAP_V3_POOL_CREATED_EVENT) {
        await UniV3PoolSingleton.initInstance();
    }
    if (SCRAPER_MODE === 'BLOCKS') {
        schedule(producer, blockEventsScraper.getParseSaveAsync, 'Pull and Save Blocks and Events');
        //schedule(producer, blockEventsScraper.backfillAsync, 'Backfill Blocks and Events');
    } else if (SCRAPER_MODE === 'EVENTS') {
        /*
    schedule(null, currentBlockMonitor.monitor, 'Current Block');
    schedule(producer, blockScraper.getParseSaveEventsAsync, 'Pull and Save Blocks');
    schedule(producer, eventsByTopicScraper.getParseSaveEventsAsync, 'Pull and Save Events by Topic');
    schedule(producer, eventsBackfillScraper.getParseSaveEventsAsync, 'Backfill Events by Topic');
    schedule(producer, backfillTxScraper.getParseSaveTxBackfillAsync, 'Pull and Save Backfill Transactions');
    schedule(producer, tokensFromBackfill.getParseSaveTokensFromBackfillAsync, 'Pull and Save Backfill Tokens');

    if (FEAT_TOKENS_FROM_TRANSFERS) {
        schedule(
            producer,
            tokensFromTransfersScraper.getParseSaveTokensFromTransfersAsync,
            'Pull and Save Tokens From Transfers',
        );
    }
    */
    }
})();

async function schedule(producer: Producer | null, func: any, funcName: string) {
    const start = new Date().getTime();
    await func(producer);
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
        schedule(producer, func, funcName);
    }, wait);
}
