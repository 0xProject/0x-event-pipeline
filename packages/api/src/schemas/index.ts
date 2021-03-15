import { Schema, SchemaValidator } from '@0x/json-schemas';

import * as stakingEpochRequestSchema from './staking_epoch_request_schema.json';

// Use to validate incoming requests
export const schemas: { [id: string]: Schema } = {
    stakingEpochRequestSchema,
};

export const schemaValidator = new SchemaValidator();

for (const schema of Object.values(schemas)) {
    schemaValidator.addSchema(schema);
}
