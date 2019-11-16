// load env vars
import { resolve } from "path";
import { config } from "dotenv";
import * as cron from 'node-cron';
config({ path: resolve(__dirname, "../../.env") });

import { ConnectionOptions, createConnection } from 'typeorm';
import * as ormConfig from './ormconfig';
import { SECONDS_BETWEEN_RUNS } from './config';

import { EventScraper } from './scripts/pull_and_save_events';
import { DeploymentScraper } from './scripts/pull_and_save_deployment';

console.log("App is running...");

const eventScraper = new EventScraper();
const deploymentScraper = new DeploymentScraper();

// run pull and save events
createConnection(ormConfig as ConnectionOptions).then(async connection => {

    await deploymentScraper.getParseSaveStakingProxyContractDeployment(connection);

    cron.schedule(`*/${SECONDS_BETWEEN_RUNS} * * * * *`, () => {
        eventScraper.getParseSaveEventsAsync(connection);
    });

}).catch(error => console.log(error));
