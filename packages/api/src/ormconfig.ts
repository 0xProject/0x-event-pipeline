// hack (xianny)
// export * as config from '../../event-pipeline/src/ormconfig';

import { ConnectionOptions } from 'typeorm';
import { POSTGRES_URI, SHOULD_SYNCHRONIZE } from './config';

export const config: ConnectionOptions = {
    type: 'postgres',
    url: POSTGRES_URI,
    synchronize: SHOULD_SYNCHRONIZE,
    logging: ['error'],
};
