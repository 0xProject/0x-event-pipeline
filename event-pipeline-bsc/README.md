# 0x-event-pipeline

A node.js app that was originally designed for pulling 0x staking events info, but now expanded to all other 0x related events.

## Getting started

Test locally:

-   Step 1  
    Rename the `.env.exmaple` file to `.env`, or create a new `.env` file. Add the required env variables (see below for configureation details)

-   Step 2  
    Set up the database variables in `docker-compose.yml` file to the desired database destination.

```
$ docker-compose up # get postgres up
```

-   Step 3 Test build & Debug

```
$ yarn install
$ yarn build
```

-   Step 4 Build migrations  
    If there are new tables to be created, or schema changes, you will need to create migration files first:

```
yarn migrate:create -n <YourMigrationName>
```

Modify the migration file in `migrations/` folder with necessary changes.

Run migration:

```
$ yarn migrate:run

```

To revert migration:

```
$ yarn migrate:revert

```

-   Step 5  
    Start the scraper:

```
$ yarn start
```

## Configuration

### Environment variables:

**Required**

`ETHEREUM_RPC_URL` - The RPC URL to use. Must match `CHAIN_ID`.

**Optional**

`POSTGRES_URI` - The full postgres URI to connect to. Defaults to local development.

`START_BLOCK_OFFSET` - How many blocks before the current block to search for events, allowing for updates to previously scraped events that may be in orphaned blocks.

`MAX_BLOCKS_TO_PULL` - The maximum number of blocks to pull at once.

`MAX_BLOCKS_TO_SEARCH` - The maximum number of blocks to search for events at once.

`CHAIN_ID` - The BSC chain id.

`BLOCK_FINALITY_THRESHOLD` - How many blocks before the current block to end the search, allowing you to limit your event scrape to blocks that are relatively more settled.

`SECONDS_BETWEEN_RUNS` - How long to wait between scrapes.

`SHOULD_SYNCHRONIZE` - Whether typeorm should synchronize with the database from `POSTGRES_URI`.

`STAKING_POOLS_JSON_URL` - The source for the JSON mapping of staking pools to UUIDs (for grabbing metadata about pools). Defaults to the 0x staking pool registry GitHub repo.

`STAKING_POOLS_METADATA_JSON_URL` - The source for the JSON mapping of UUIDs to metadata. Defaults to the 0x staking pool registry GitHub repo.

`BASE_GITHUB_LOGO_URL` - The base URL for grabbing logos for staking pools. Defaults to the 0x staking pool registry GitHub repo.

## Database snapshots

When running the app on a new database it can take a long time to find new events depending on how much time has passed since the contracts were deployed. There are options to dump and restore data from other sources using `pg_dump` ([Documentation](https://www.postgresql.org/docs/9.6/app-pgdump.html)) and `pg_restore` ([Documentation](https://www.postgresql.org/docs/9.2/app-pgrestore.html)). Some examples are outlined below.

These examples will require `postgresql` to be installed.

```
$ brew install postgresql
```

### Getting data from another database

If you know of another database that contains up-to-date data, you can `pg_dump` data from the relevant schemas from that database by running:

```
$ pg_dump -h <host> -U <user> -p <port> --schema staking --schema events --data-only --file events.dump --format=c <database name>
```

To save a `pg_dump` archive file named `events.dump`. The command will prompt you for the password.

### Restoring data from a pg_dump

If you have access to a `.dump` file you can `pg_restore` data from that file into another database.

To restore data into the default development database that is spun up by `docker-compose up`, you can run:

```
$ pg_restore --data-only --dbname events --host localhost --port 5432 -U user events.dump
```

Assuming you have access to an `events.dump` file. The command will prompt you for the password.
