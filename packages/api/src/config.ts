import { HttpServiceConfig } from '@0x/api-utils';
import { assert } from '@0x/assert';
import { isEmpty } from 'lodash';

import {
    DEFAULT_API_ROOT,
    DEFAULT_LOG_LEVEL,
    DEFAULT_LOGGER_INCLUDE_TIMESTAMP,
    DEFAULT_HTTP_PORT,
    DEFAULT_HEALTHCHECK_HTTP_PORT,
    DEFAULT_HEALTHCHECK_PATH,
    DEFAULT_HTTP_KEEP_ALIVE_TIMEOUT,
    DEFAULT_HTTP_HEADERS_TIMEOUT,
    DEFAULT_ENABLE_PROMETHEUS_METRICS,
    DEFAULT_PROMETHEUS_PORT,
    DEFAULT_PROMETHEUS_PATH,
    DEFAULT_POSTGRES_URI,
} from './constants';

// TODO (xianny): assert that values are non-empty

// HTTP service configs
export const API_ROOT = isEmpty(process.env.API_ROOT) ? DEFAULT_API_ROOT : String(process.env.API_ROOT);
export const HTTP_PORT = isEmpty(process.env.HTTP_PORT) ? DEFAULT_HTTP_PORT : parseInt(process.env.HTTP_PORT!);
export const HEALTHCHECK_HTTP_PORT = isEmpty(process.env.HEALTHCHECK_HTTP_PORT)
    ? DEFAULT_HEALTHCHECK_HTTP_PORT
    : parseInt(process.env.HEALTHCHECK_HTTP_PORT!);
export const HEALTHCHECK_PATH = isEmpty(process.env.HEALTHCHECK_PATH)
    ? DEFAULT_HEALTHCHECK_PATH
    : process.env.HEALTHCHECK_PATH;
export const HTTP_KEEP_ALIVE_TIMEOUT = isEmpty(process.env.HTTP_KEEP_ALIVE_TIMEOUT)
    ? DEFAULT_HTTP_KEEP_ALIVE_TIMEOUT
    : parseInt(process.env.HTTP_KEEP_ALIVE_TIMEOUT!);
export const HTTP_HEADERS_TIMEOUT = isEmpty(process.env.HTTP_HEADERS_TIMEOUT)
    ? DEFAULT_HTTP_HEADERS_TIMEOUT
    : parseInt(process.env.HTTP_HEADERS_TIMEOUT!);
export const ENABLE_PROMETHEUS_METRICS = isEmpty(process.env.ENABLE_PROMETHEUS_METRICS)
    ? DEFAULT_ENABLE_PROMETHEUS_METRICS
    : process.env.ENABLE_PROMETHEUS_METRICS === 'true';
export const PROMETHEUS_PORT = isEmpty(process.env.PROMETHEUS_PORT)
    ? DEFAULT_PROMETHEUS_PORT
    : parseInt(process.env.PROMETHEUS_PORT!);
export const PROMETHEUS_PATH = isEmpty(process.env.PROMETHEUS_PATH)
    ? DEFAULT_PROMETHEUS_PATH
    : process.env.PROMETHEUS_PATH;
export const defaultHttpServiceConfig: HttpServiceConfig = {
    httpPort: HTTP_PORT,
    healthcheckHttpPort: HEALTHCHECK_HTTP_PORT,
    healthcheckPath: HEALTHCHECK_PATH!,
    httpKeepAliveTimeout: HTTP_KEEP_ALIVE_TIMEOUT,
    httpHeadersTimeout: HTTP_HEADERS_TIMEOUT,
    enablePrometheusMetrics: ENABLE_PROMETHEUS_METRICS,
    prometheusPort: PROMETHEUS_PORT,
    prometheusPath: PROMETHEUS_PATH!,
};

// Postgres configs
export const SHOULD_SYNCHRONIZE = process.env.SHOULD_SYNCHRONIZE === 'true';
export const POSTGRES_URI = isEmpty(process.env.POSTGRES_URI) ? DEFAULT_POSTGRES_URI : process.env.POSTGRES_URI!;

// Log level for pino.js
export const LOG_LEVEL = isEmpty(process.env.LOG_LEVEL) ? DEFAULT_LOG_LEVEL : process.env.LOG_LEVEL;

// Should the logger include time field in the output logs
export const LOGGER_INCLUDE_TIMESTAMP = isEmpty(process.env.LOGGER_INCLUDE_TIMESTAMP)
    ? DEFAULT_LOGGER_INCLUDE_TIMESTAMP
    : process.env.LOGGER_INCLUDE_TIMESTAMP === 'true';
