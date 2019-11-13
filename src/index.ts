// load env vars
import { resolve } from "path";
import { config } from "dotenv";
import * as cron from 'node-cron';
config({ path: resolve(__dirname, "../../.env") });

import { ConnectionOptions, createConnection } from 'typeorm';
import * as ormConfig from './ormconfig';

import { EventScraper } from './scripts/pull_and_save_events';

import * as defaults from "../config/defaults.json";

console.log("App is running...");

const eventScraper = new EventScraper();

// run pull and save events
createConnection(ormConfig as ConnectionOptions).then(async connection => {

    cron.schedule(`*/${defaults.secondsBetweenRuns} * * * * *`, () => {
        eventScraper.getParseSaveEventsAsync(connection);
    });

}).catch(error => console.log(error));
