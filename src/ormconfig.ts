import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
    type: 'postgres',
    url: process.env.ZEROEX_DATA_PIPELINE_DB_URL,
    synchronize: false,
    logging: ['error'],
    entities: ['src/entites/**/*.js'],
    migrations: ['lib/migrations/*.js'],
    migrationsTableName: 'event_pipeline_migrations'
};

module.exports = config;
