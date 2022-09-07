import { Producer } from 'kafkajs';
const { SchemaRegistry, SchemaType, avdlToAVSCAsync } = require('@kafkajs/confluent-schema-registry');
import { Type, Schema, types } from 'avsc';

import { BigNumber } from '@0x/utils';

import { logger } from '../utils';

export interface SchemaOptions {
    precision: number;
    scale: number;
}

class AvroBigNumber extends types.LogicalType {
    public precision: number;
    public scale: number;

    public constructor(schema: any, opts?: unknown) {
        super(schema, opts);
        this.precision = schema.precision;
        this.scale = schema.scale;
    }

    public _export(attrs: Schema & SchemaOptions): void {
        attrs.precision = this.precision;
        attrs.scale = this.scale;
    }

    public _resolve(type: Type & SchemaOptions): (<T>(x: T) => T) | undefined {
        if (
            type instanceof AvroBigNumber &&
            Type.isType(type, 'logical:decimal') &&
            type.precision === this.precision &&
            type.scale === this.scale
        ) {
            return <T>(x: T): T => x;
        } else {
            return undefined;
        }
    }
    public _fromValue(buf: unknown): BigNumber {
        console.log('bbbbbbbbbbbb');
        if (!(buf instanceof Buffer)) {
            throw new Error('expecting underlying Buffer type');
        }

        if (buf.length > 8) {
            throw new Error('buffers with more than 64bits are not supported');
        }

        return new BigNumber(buf.toString('hex')).dividedBy(10 ** this.scale);
    }

    public _toValue(val: unknown): Buffer {
        console.log('aaaaaaaaaaaaaaaaaaaa');
        console.log(val);
        if (!(val instanceof BigNumber || val instanceof Number)) {
            throw new Error('expecting BigNumber or number type');
        }

        return Buffer.from(val.toString(16), 'hex');
    }
}

const options = { forSchemaOptions: { logicalTypes: { decimal: AvroBigNumber } } };

const registry = new SchemaRegistry(
    {
        host: 'https://psrc-nx65v.us-east-2.aws.confluent.cloud',
        auth: {
            username: 'L6D6UAVFI5YGQJXV',
            password: 'B9iYpYb4NIvTY3bFuknZyIH+imhVkJXGKWZUGgOiCMUq7cxV6u0zLaiCOEe+0RrR',
        },
    },
    options,
);

export async function kafkaSendAsync(producer: Producer, topic: string, keyField: string, payload: any[]) {
    if (topic === 'event-scraper.ethereum.blocks.v0') {
        const MAX_SIZE = 1000000; // 1MB

        let currentSize = 0;
        let messages = [];
        const schemaId = await registry.getLatestSchemaId(`${topic}-value`);

        for (const message of payload) {
            const jsonMessage = JSON.stringify(message);
            const key = String(message[keyField]);
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
            messages.push({ key, value: registry.encode(schemaId, message) });
        }
        await producer.send({
            topic,
            messages,
        });

        logger.info(`Emitted ${payload.length} messages to ${topic}`);
    }
}
