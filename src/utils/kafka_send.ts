import { Producer } from 'kafkajs';
import { logger } from '../utils';

export async function kafkaSendAsync(producer: Producer, topic: string, payload: any[]) {
    const MAX_SIZE = 1000000; // 1MB

    let currentSize = 0;
    let messages = [];
    for (const message of payload) {
        const jsonMessage = JSON.stringify(message);
        const messageLength = jsonMessage.length;

        if (currentSize + messageLength >= MAX_SIZE) {
            await producer.send({
                topic,
                messages: messages.map((msg) => ({ value: msg })),
            });
            currentSize = 0;
            messages = [];
        }
        currentSize += messageLength;
        messages.push(jsonMessage);
    }
    await producer.send({
        topic,
        messages: messages.map((msg) => ({ value: msg })),
    });

    logger.info(`Emitted ${payload.length} messages to ${topic}`);
}
