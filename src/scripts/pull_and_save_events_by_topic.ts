import { Producer } from 'kafkajs';
import { web3Factory } from '@0x/dev-utils';
import { logger } from '../utils/logger';
import { Connection } from 'typeorm';
import { Web3Source } from '../data_sources/events/web3';
import { calculateEndBlockAsync } from './utils/shared_utils';

import { getParseSaveTxAsync } from './utils/web3_utils';
import { PullAndSaveEventsByTopic } from './utils/event_abi_utils';

import { ETHEREUM_RPC_URL } from '../config';
import { eventScrperProps, EventScraperProps, CommonEventParams } from '../events';

import { SCRIPT_RUN_DURATION } from '../utils/metrics';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});
const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);

const pullAndSaveEventsByTopic = new PullAndSaveEventsByTopic();

export class EventsByTopicScraper {
    public async getParseSaveEventsAsync(connection: Connection, producer: Producer): Promise<void> {
        const startTime = new Date().getTime();
        logger.info(`Pulling Events by Topic`);
        const latestBlockWithOffset = await calculateEndBlockAsync(web3Source);

        logger.child({ latestBlockWithOffset }).info(`latest block with offset: ${latestBlockWithOffset}`);

        const promises: Promise<string[]>[] = [];

        const commonParams: CommonEventParams = {
            connection,
            producer,
            web3Source,
        };

        eventScrperProps.forEach((props: EventScraperProps) => {
            if (props.enabled) {
                promises.push(
                    pullAndSaveEventsByTopic.getParseSaveEventsByTopic(
                        commonParams.connection,
                        commonParams.producer,
                        commonParams.web3Source,
                        latestBlockWithOffset,
                        props.name,
                        props.tType,
                        props.table,
                        props.topics,
                        props.contractAddress,
                        props.startBlock,
                        props.parser,
                        props.deleteOptions,
                        props.tokenMetadataMap,
                    ),
                );
            }
        });

        const txHashes = [
            ...new Set(
                (await Promise.all(promises)).reduce(
                    (accumulator: string[], value: string[]) => accumulator.concat(value),
                    [],
                ),
            ),
        ] as string[];

        if (txHashes.length) {
            await getParseSaveTxAsync(connection, producer, web3Source, txHashes);
        }

        const endTime = new Date().getTime();
        const scriptDurationSeconds = (endTime - startTime) / 1000;
        SCRIPT_RUN_DURATION.set({ script: 'events-by-topic' }, scriptDurationSeconds);

        logger.info(`Finished pulling events by topic in ${scriptDurationSeconds}`);
    }
}
