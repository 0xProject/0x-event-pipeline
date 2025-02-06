import { logger } from './logger';

export async function retry<T extends (...arg0: any[]) => any>(
    fn: T,
    args: Parameters<T>,
    maxTry: number,
    retryCount = 1,
): Promise<Awaited<ReturnType<T>>> {
    const currRetry = typeof retryCount === 'number' ? retryCount : 1;
    try {
        logger.info(`Attempt #${currRetry}.`);
        const result = await fn(...args);
        return result;
    } catch (e) {
        logger.info(`Retry ${currRetry} failed.`);
        if (currRetry > maxTry) {
            logger.info(`All ${maxTry} retry attempts exhausted`);
            throw e;
        }
        return retry(fn, args, maxTry, currRetry + 1);
    }
}
