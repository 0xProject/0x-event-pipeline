import { ObjectMap } from './types';
import { fetchAsync } from '@0x/utils';
import { CRYPTOCOMPARE_API_KEY } from './config';

export function arrayToMapWithId<T extends object>(array: T[], idKey: keyof T): ObjectMap<T> {
    const initialMap: ObjectMap<T> = {};
    return array.reduce((acc, val) => {
        const id = val[idKey] as any;
        acc[id] = val;
        return acc;
    }, initialMap);
}

export async function getPriceAtTimestamp(symbol: string, ts: number): Promise<number> {
    symbol = symbol.toUpperCase();
    const baseURI = 'https://min-api.cryptocompare.com/data/pricehistorical';
    const tradingPairQuerystring = `?fsym=${symbol}&tsyms=USD`;
    const timestampQuerystring = `&ts=${ts}`;
    const apiKeyQuerystring = `&=api_key=${CRYPTOCOMPARE_API_KEY}`;

    const requestURI = baseURI + tradingPairQuerystring + timestampQuerystring + apiKeyQuerystring;
    const response = await fetchAsync(requestURI);
    // add type to result
    const result = await response.json();
    return result[symbol]['USD'];
}
