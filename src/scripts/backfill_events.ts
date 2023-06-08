import { Producer } from 'kafkajs';
import { web3Factory } from '@0x/dev-utils';
import { logger } from '../utils/logger';
import { Connection } from 'typeorm';
import { Web3Source } from '../data_sources/events/web3';

import { getParseSaveTxAsync } from './utils/web3_utils';
import { PullAndSaveEventsByTopic } from './utils/event_abi_utils';

import { ETHEREUM_RPC_URL } from '../config';
import { eventScrperProps, EventScraperProps, CommonEventParams } from '../events';

import { SCRIPT_RUN_DURATION } from '../utils/metrics';

import { EventBackfill } from '../entities';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});
const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);

const pullAndSaveEventsByTopic = new PullAndSaveEventsByTopic();

export class EventsBackfillScraper {
    public async getParseSaveEventsAsync(connection: Connection, producer: Producer): Promise<void> {
        const startTime = new Date().getTime();
        logger.info(`Pulling Events by Topic`);
        const currentBlock = await web3Source.getCurrentBlockAsync();

        logger.info(`latest block: ${currentBlock.number}`);

        const promises: Promise<string[]>[] = [];

        const commonParams: CommonEventParams = {
            connection,
            producer,
            web3Source,
        };

        const oldestBlocksForEvents = await connection
            .getRepository(EventBackfill)
            .createQueryBuilder('event')
            .select('event.name', 'name')
            .addSelect('MIN(event.blockNumber)', 'oldestBlockNumber')
            .groupBy('event.name')
            .getRawMany();

        const backfillEventsOldestBlock = new Map<string, number>();

        oldestBlocksForEvents.forEach((event) => {
            backfillEventsOldestBlock.set(event.name, parseInt(event.oldestBlockNumber));
        });

        eventScrperProps.forEach((props: EventScraperProps) => {
            if (backfillEventsOldestBlock.has(props.name)) {
                promises.push(
                    pullAndSaveEventsByTopic
                        .getParseSaveEventsByTopicBackfill(
                            commonParams.connection,
                            commonParams.producer,
                            commonParams.web3Source,
                            currentBlock,
                            props.name,
                            props.tType,
                            props.table,
                            props.topics,
                            props.contractAddress,
                            props.startBlock,
                            props.parser,
                            props.deleteOptions,
                            props.tokenMetadataMap,
                            backfillEventsOldestBlock.get(props.name)!,
                        )
                        .then(async ({ transactionHashes, startBlockNumber, endBlockNumber }) => {
                            if (startBlockNumber !== null && endBlockNumber !== null) {
                                await connection
                                    .getRepository(EventBackfill)
                                    .createQueryBuilder('event')
                                    .delete()
                                    .from(EventBackfill)
                                    .where('blockNumber >= :startBlock', { startBlockNumber })
                                    .andWhere('blockNumber <= :endBlock', { endBlockNumber })
                                    .execute();
                            }

                            return transactionHashes;
                        }),
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
        SCRIPT_RUN_DURATION.set({ script: 'events-by-topic-backfill' }, scriptDurationSeconds);

        logger.info(`Finished backfilling events by topic in ${scriptDurationSeconds}`);
    }
}
