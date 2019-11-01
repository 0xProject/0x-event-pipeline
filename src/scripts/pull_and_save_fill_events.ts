import { web3Factory } from '@0x/dev-utils';
import { Web3ProviderEngine } from '@0x/subproviders';
import { logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import 'reflect-metadata';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { handleError } from '../utils'

import { ExchangeEventsSource } from '../data_sources/events/0x_events';
import { FillEvent } from '../entities';
import * as ormConfig from '../ormconfig';
import { parseFillEvents } from '../parsers/events/fill_events';

import * as config from "../../config/defaults.json";

const BLOCK_FINALITY_THRESHOLD = 10; // When to consider blocks as final. Used to compute default endBlock.

let connection: Connection;

(async () => {
    connection = await createConnection(ormConfig as ConnectionOptions);
    const provider = web3Factory.getRpcProvider({
        rpcUrl: process.env.WEB3_ENDPOINT,
    });
    
    logUtils.log(`pulling fill events`);
    const endBlock = await calculateEndBlockAsync(provider);
    const eventsSource = new ExchangeEventsSource(provider, config.network);

    const startBlock = await getStartBlockAsync('fillEvent');

    const eventLogs = await eventsSource.getFillEventsAsync(startBlock, endBlock);

    const parsedEventLogs = parseFillEvents(eventLogs);

    const repository = connection.getRepository(FillEvent);
    logUtils.log(`saving ${parseFillEvents.length} events`);
    repository.save(parsedEventLogs);

    process.exit(0);
})().catch(handleError);

async function getStartBlockAsync(eventName: string): Promise<number> {
    const queryResult = await connection.query(
        `SELECT COALESCE(MAX(last_processed_block_number),${config.firstSearchBlock})::VARCHAR FROM events.last_block_processed WHERE event_name = '${eventName}'`,
    );
    const lastKnownBlock = queryResult[0].last_processed_block_number;
    return lastKnownBlock - config.startBlockOffset;
}

async function calculateEndBlockAsync(provider: Web3ProviderEngine): Promise<number> {
    const web3Wrapper = new Web3Wrapper(provider);
    const currentBlock = await web3Wrapper.getBlockNumberAsync();
    return currentBlock - BLOCK_FINALITY_THRESHOLD;
}
