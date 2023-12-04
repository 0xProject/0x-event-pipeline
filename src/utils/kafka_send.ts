import { Producer } from 'kafkajs';

import { logger } from './logger';

export interface SchemaOptions {
    precision: number;
    scale: number;
}

export interface DeleteOptions {
    directFlag?: boolean;
    directProtocol?: string[];
    protocolVersion?: string;
    nativeOrderType?: string;
    protocol?: string;
    recipient?: string;
}

interface DeleteCommandDetails {
    startBlockNumber: number;
    endBlockNumber: number;
    deleteOptions: DeleteOptions;
}

export interface CommandMessage {
    command: 'delete';
    details: DeleteCommandDetails;
}

export async function kafkaSendRawAsync(
    producer: Producer | null,
    topic: string,
    keyFields: string[],
    payload: any[],
): Promise<void> {
    const MAX_SIZE = 100000;

    let currentSize = 0;
    let messages = [];

    if (producer !== null) {
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
    }
}

export async function kafkaSendAsync(
    producer: Producer | null,
    topic: string,
    keyFields: string[],
    payload: any[],
): Promise<void> {
    const dataPayload = payload.map((message) => {
        return { type: 'data', message };
    });
    if (producer != null) {
        await kafkaSendRawAsync(producer, topic, keyFields, dataPayload);
    }
}

export async function kafkaSendCommandAsync(
    producer: Producer | null,
    topic: string,
    keyFields: string[],
    payload: CommandMessage[],
): Promise<void> {
    const commandPayload = payload.map((message) => {
        return { type: 'command', message };
    });
    if (producer != null) {
        await kafkaSendRawAsync(producer, topic, keyFields, commandPayload);
    }
}
