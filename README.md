# 0x-event-pipeline
A node.js app for pulling 0x event info to inform things like staking.

## Getting started

```
$ docker-compose up # get local postgres up
$ yarn
$ yarn build
$ yarn migrate:run
$ yarn start
```

## Configuration

### Environment variables:

**Required**

`ETHEREUM_RPC_URL` - The RPC URL to use. Must match `CHAIN_ID`.

**Optional**

`POSTGRES_URI` - The full postgres URI to connect to. Defaults to local development.

`FIRST_SEARCH_BLOCK` - The first block number to search when scraping.

`START_BLOCK_OFFSET` - How many blocks before the current block to search for events, allowing for updates to previously scraped events that may be in orphaned blocks.

`MAX_BLOCKS_TO_PULL` - The maximum number of blocks to pull at once.

`MAX_BLOCKS_TO_SEARCH` - The maximum number of blocks to search at once.

`CHAIN_ID` - The Ethereum chain id.

`BLOCK_FINALITY_THRESHOLD` - How many blocks until a transaction is considered final.

`SECONDS_BETWEEN_RUNS` - How long to wait between scrapes.

`SHOULD_SYNCHRONIZE` - Whether typeorm should synchronize with the database from `POSTGRES_URI`.
