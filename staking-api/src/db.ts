import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import { config } from './ormconfig';

let connection: Connection;

/**
 * Creates the DB connnection to use in an app
 */
export async function getDbAsync(): Promise<Connection> {
    if (!connection) {
        connection = await createConnection((config as any) as ConnectionOptions);
    }
    return connection;
}
