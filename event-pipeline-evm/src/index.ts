// load env vars
import { resolve } from 'path';
import { config } from 'dotenv';
import * as cron from 'node-cron';
config({ path: resolve(__dirname, '../../.env') });

import { ConnectionOptions, createConnection } from 'typeorm';
import * as ormConfig from './ormconfig';
import { CHAIN_ID, ENABLE_PROMETHEUS_METRICS, SECONDS_BETWEEN_RUNS } from './config';

import { EventScraper } from './scripts/pull_and_save_events';
import { EventsByTopicScraper } from './scripts/pull_and_save_events_by_topic';
import { ChainIdChecker } from './scripts/check_chain_id';
import { CurrentBlockMonitor } from './scripts/monitor_current_block';
import { startMetricsServer } from './utils/metrics';

console.log('App is running...');

const chainIdChecker = new ChainIdChecker();
const eventScraper = new EventScraper();
const eventsByTopicScraper = new EventsByTopicScraper();
const currentBlockMonitor = new CurrentBlockMonitor();

if (ENABLE_PROMETHEUS_METRICS) {
    startMetricsServer();
}

chainIdChecker.checkChainId(CHAIN_ID);

// run pull and save events
createConnection(ormConfig as ConnectionOptions)
    .then(async (connection) => {
        //schedule(null, currentBlockMonitor.monitor, 'Current Block');
        schedule(connection, eventScraper.getParseSaveEventsAsync, 'Pull and Save Events');
        //schedule(connection, eventsByTopicScraper.getParseSaveEventsAsync, 'Pull and Save Events by Topic');
    })
    .catch((error) => console.log(error));

async function schedule(connection: any, func: any, funcName: string) {
    const start = new Date().getTime();
    await func(connection);
    const end = new Date().getTime();
    const duration = end - start;
    let wait: number;
    if (duration > SECONDS_BETWEEN_RUNS * 1000) {
        wait = 0;
        console.warn(`${funcName} is taking longer than desiered interval`);
    } else {
        wait = SECONDS_BETWEEN_RUNS * 1000 - duration;
    }

    setTimeout(() => {
        schedule(connection, func, funcName);
    }, wait);
}
