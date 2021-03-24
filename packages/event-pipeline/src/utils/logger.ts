import * as pino from 'pino';

export const logger = pino({
    level: 'info',
    useLevelLabels: true,
    timestamp: true,
});
