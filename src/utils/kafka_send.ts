import { Producer } from 'kafkajs';

import { BigNumber } from '@0x/utils';

import { logger } from '../utils';

export interface SchemaOptions {
    precision: number;
    scale: number;
}

export async function kafkaSendAsync(producer: Producer, topic: string, keyFields: string[], payload: any[]) {
    // if (topic === 'event-scraper.ethereum.blocks.v0') {
    const MAX_SIZE = 500000; // 1MB

    let currentSize = 0;
    let messages = [];

    for (const message of payload) {
        const jsonMessage = JSON.stringify(message);
        const keyValues = keyFields.map((keyField) => String(message[keyField]));
        const key = keyValues.join('-');
        const messageLength = jsonMessage.length;

        if (currentSize + messageLength >= MAX_SIZE) {
            await producer.send({
                topic,
                messages,
            });
            currentSize = 0;
            messages = [];
        }
        currentSize += messageLength;
        messages.push({ key, value: jsonMessage });
    }
    await producer.send({
        topic,
        messages,
    });

    logger.info(`Emitted ${payload.length} messages to ${topic}`);
    // }
}
