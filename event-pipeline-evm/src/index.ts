// load env vars
import { resolve } from 'path';
import { config } from 'dotenv';
import * as cron from 'node-cron';
config({ path: resolve(__dirname, '../../.env') });

import { ConnectionOptions, createConnection } from 'typeorm';
import * as ormConfig from './ormconfig';
import { MINUTES_BETWEEN_RUNS, CHAIN_ID } from './config';

import { EventScraper } from './scripts/pull_and_save_events';
import { EventsByTopicScraper } from './scripts/pull_and_save_events_by_topic';
import { ChainIdChecker } from './scripts/check_chain_id';

console.log('App is running...');

const chainIdChecker = new ChainIdChecker();
const eventScraper = new EventScraper();
const eventsByTopicScraper = new EventsByTopicScraper();

// run pull and save events
createConnection(ormConfig as ConnectionOptions)
    .then(async connection => {
        await chainIdChecker.checkChainIdAsync(CHAIN_ID);
        cron.schedule(`*/${MINUTES_BETWEEN_RUNS} * * * *`, () => {
            Promise.all([
                eventScraper.getParseSaveEventsAsync(connection),
                eventsByTopicScraper.getParseSaveEventsAsync(connection),
            ]);
        });
    })
    .catch(error => console.log(error));
