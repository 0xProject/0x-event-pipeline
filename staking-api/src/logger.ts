import * as pino from 'pino';

import { LOGGER_INCLUDE_TIMESTAMP, LOG_LEVEL } from './config';

export const logger = pino({
    level: LOG_LEVEL,
    useLevelLabels: true,
    timestamp: LOGGER_INCLUDE_TIMESTAMP,
});
