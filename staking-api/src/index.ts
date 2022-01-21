/**
 * This module can be used to run the Staking HTTP service standalone
 */
import { createDefaultServer, cacheControl, HttpServiceConfig } from '@0x/api-utils';
import * as express from 'express';
import { Server } from 'http';

// import { addressNormalizer } from '../middleware/address_normalizer';
// import { errorHandler } from '../middleware/error_handling';
// import { rootHandler } from '../handlers/root_handler';

import { defaultHttpServiceConfig, API_ROOT } from './config';
import { logger } from './logger';
import { createStakingRouter } from './router';
import { QueryRunner } from './query_runner';
import { DEFAULT_CACHE_AGE_SECONDS } from './constants';

process.on('uncaughtException', (err: any) => {
    logger.error(err);
    process.exit(1);
});

process.on('unhandledRejection', (err: any) => {
    if (err) {
        logger.error(err);
    }
});

if (require.main === module) {
    (async () => {
        await runHttpServiceAsync(defaultHttpServiceConfig);
    })().catch(error => logger.error(error.stack));
}

async function destroyCallback(): Promise<void> {
    return;
}

async function runHttpServiceAsync(config: HttpServiceConfig, _app?: express.Express): Promise<Server> {
    const app = _app || express();
    // app.use(addressNormalizer);
    app.use(cacheControl(DEFAULT_CACHE_AGE_SECONDS));
    const server = createDefaultServer(config, app, logger, destroyCallback);

    // app.get('/', rootHandler);
    // staking http service
    const db = new QueryRunner();
    app.use(API_ROOT, createStakingRouter(db));
    // app.use(errorHandler);

    server.listen(config.httpPort);
    return server;
}
