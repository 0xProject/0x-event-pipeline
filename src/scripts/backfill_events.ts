import { Web3Source } from '../data_sources/events/web3.ts';
import { eventScrperProps, EventScraperProps, CommonEventParams } from '../events.ts';
import { logger } from '../utils/logger.ts';
import { SCRIPT_RUN_DURATION } from '../utils/metrics.ts';
import { PullAndSaveEventsByTopic } from './utils/event_abi_utils.ts';
import { getParseSaveTxAsync } from './utils/web3_utils.ts';
import { Producer } from 'kafkajs';
import prisma from '../client.ts';
import { Prisma, PrismaClient } from '@prisma/client';

const web3Source = new Web3Source();

const pullAndSaveEventsByTopic = new PullAndSaveEventsByTopic();

export class EventsBackfillScraper {
    public async getParseSaveEventsAsync(producer: Producer): Promise<void> {
        const startTime = new Date().getTime();
        const oldestBlocksForEvents = await prisma.eventBackfill.groupBy({
            by: ['name'],
            _min: {
                blockNumber: true,
            },
        });
        if (oldestBlocksForEvents.length > 0) {
            logger.info(`Pulling Events by Topic Backfill`);

            const backfillEventsOldestBlock = new Map<string, number>();

            oldestBlocksForEvents.forEach((event) => {
                backfillEventsOldestBlock.set(event.name, parseInt(event._min.blockNumber));
            });

            const currentBlock = await web3Source.getCurrentBlock();

            const promises: Promise<string[]>[] = [];

            const commonParams: CommonEventParams = {
                producer,
                web3Source,
            };

            eventScrperProps.forEach((props: EventScraperProps) => {
                if (backfillEventsOldestBlock.has(props.name)) {
                    promises.push(
                        pullAndSaveEventsByTopic
                            .getParseSaveEventsByTopicBackfill(
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
                                backfillEventsOldestBlock.get(props.name)!,
                                props.deleteOptions,
                                props.tokenMetadataMap,
                                props.postProcess,
                                props.filterFunctionGetContext,
                            )
                            .then(async ({ transactionHashes, startBlockNumber, endBlockNumber }) => {
                                if (startBlockNumber !== null && endBlockNumber !== null) {
                                    await connection
                                        .getRepository(EventBackfill)
                                        .createQueryBuilder('event')
                                        .delete()
                                        .from(EventBackfill)
                                        .where('blockNumber >= :startBlockNumber', { startBlockNumber })
                                        .andWhere('blockNumber <= :endBlockNumber', { endBlockNumber })
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
}
