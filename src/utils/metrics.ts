import { CHAIN_NAME, METRICS_PATH, PROMETHEUS_PORT } from '../config';
import { logger } from './logger';
import express from 'express';
import { Counter, Gauge, register } from 'prom-client';

export const CURRENT_BLOCK = new Gauge({
    name: 'event_scraper_current_block',
    help: 'The current head of the chain',
    labelNames: ['chain'],
});

export const LATEST_SCRAPED_BLOCK = new Gauge({
    name: 'event_scraper_latest_scraped_block',
    help: 'The latest scraped block',
    labelNames: ['chain'],
});

export const SCRIPT_RUN_DURATION = new Gauge({
    name: 'event_scraper_script_run_duration',
    help: 'The time a script took to run',
    labelNames: ['script'],
});

export const SCAN_START_BLOCK = new Gauge({
    name: 'event_scraper_scan_start_block',
    help: 'The starting block of a blockchain scan',
    labelNames: ['type', 'event', 'includeBridgeTrades'],
});

export const SCAN_END_BLOCK = new Gauge({
    name: 'event_scraper_scan_end_block',
    help: 'The last block of a blockchain scan',
    labelNames: ['type', 'event', 'includeBridgeTrades'],
});

export const SCAN_RESULTS = new Gauge({
    name: 'event_scraper_scan_results',
    help: 'The count of how many entities are going to be saved to DB',
    labelNames: ['type', 'event', 'includeBridgeTrades'],
});

export const SAVED_RESULTS = new Counter({
    name: 'event_scraper_saved_results',
    help: 'The count of how many results are going to be saved to DB',
    labelNames: ['type', 'event'],
});

export const RPC_LOGS_ERROR = new Gauge({
    name: 'event_scraper_rpc_error',
    help: 'Counter for RPC errors',
    labelNames: ['type', 'event'],
});

export const SKIPPED_EVENTS = new Gauge({
    name: 'event_scraper_skipped_events',
    help: 'Counter for events that where skipped',
    labelNames: ['type', 'event'],
});

export const startMetricsServer = (): void => {
    const defaultLabels = { chain: CHAIN_NAME };
    register.setDefaultLabels(defaultLabels);

    const app = express();
    app.get(METRICS_PATH, async (req, res) => {
        try {
            res.set('Content-Type', register.contentType);
            res.end(await register.metrics());
        } catch (ex) {
            res.status(500).end(ex);
        }
    });
    const server = app.listen(PROMETHEUS_PORT, '0.0.0.0', () => {
        logger.info(`Metrics (HTTP) listening on port ${PROMETHEUS_PORT}`);
    });
    server.on('error', (err: Error) => {
        logger.error(err);
    });
};
