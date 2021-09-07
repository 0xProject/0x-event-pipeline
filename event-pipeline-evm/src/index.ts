// load env vars
import { resolve } from 'path';
import { config } from 'dotenv';
import * as cron from 'node-cron';
config({ path: resolve(__dirname, '../../.env') });

import { ConnectionOptions, createConnection } from 'typeorm';
import * as ormConfig from './ormconfig';
import { CHAIN_ID, ENABLE_PROMETHEUS_METRICS, FEAT_STAKING, MINUTES_BETWEEN_RUNS } from './config';

import { EventScraper } from './scripts/pull_and_save_events';
import { DeploymentScraper } from './scripts/pull_and_save_deployment';
import { MetadataScraper } from './scripts/pull_and_save_pool_metadata';
import { EventsByTopicScraper } from './scripts/pull_and_save_events_by_topic';
import { ChainIdChecker } from './scripts/check_chain_id';

import { startMetricsServer } from './utils/metrics';

console.log('App is running...');

const chainIdChecker = new ChainIdChecker();
const eventScraper = new EventScraper();
const deploymentScraper = new DeploymentScraper();
const metadataScraper = new MetadataScraper();
const eventsByTopicScraper = new EventsByTopicScraper();

if (ENABLE_PROMETHEUS_METRICS) {
    startMetricsServer();
}

chainIdChecker.checkChainId(CHAIN_ID);

// run pull and save events
createConnection(ormConfig as ConnectionOptions)
    .then(async connection => {
        cron.schedule(`*/${MINUTES_BETWEEN_RUNS} * * * *`, () => {
            Promise.all([
                eventScraper.getParseSaveEventsAsync(connection),
                eventsByTopicScraper.getParseSaveEventsAsync(connection),
            ]);
        });

        if (FEAT_STAKING) {
            await deploymentScraper.getParseSaveStakingProxyContractDeployment(connection);
            cron.schedule(`0 * * * * *`, () => {
                metadataScraper.getParseSaveMetadataAsync(connection);
            });
        }
    })
    .catch(error => console.log(error));
