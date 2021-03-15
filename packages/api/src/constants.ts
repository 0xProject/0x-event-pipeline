export const DEFAULT_CACHE_AGE_SECONDS = 10;

// Http service config
export const DEFAULT_API_ROOT = '/staking';
export const DEFAULT_HTTP_PORT = 4000;
export const DEFAULT_HEALTHCHECK_HTTP_PORT = 4000;
export const DEFAULT_HEALTHCHECK_PATH = '/healthz';
export const DEFAULT_HTTP_KEEP_ALIVE_TIMEOUT = 76 * 1000;
export const DEFAULT_HTTP_HEADERS_TIMEOUT = 77 * 1000;
export const DEFAULT_ENABLE_PROMETHEUS_METRICS = true;
export const DEFAULT_PROMETHEUS_PORT = 4000;
export const DEFAULT_PROMETHEUS_PATH = '/metrics';

// Logging
export const DEFAULT_LOG_LEVEL = 'info';
export const DEFAULT_LOGGER_INCLUDE_TIMESTAMP = true;

// Postgres
export const DEFAULT_POSTGRES_URI = 'postgresql://user:password@localhost/events'; // default connection to docker-compose postgres instance
