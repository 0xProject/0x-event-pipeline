# 0x-event-pipeline

EVM Blockchain Scraper, mainly for 0x Protocol Events and some extra useful Events.

**NOTE**: Due to new optimizations, starting to scrape a chain from scratch is currently not straight forward, please read the whole document before starting

## Getting started

Run locally:

1. Copy the `.env.exmaple` file to `.env`.
Add the `RPC_URL` for the chain(s) you are going to run
Configure the scape **Mode**

2. Start Postgres

```sh
docker-compose up -d # get postgres up
```

3. Build the Scraper images

```sh
docker-compose build
```

4. Start the scraper(s)

```sh
docker-compose up event-pipeline-ethereum # change the chain name
```

## Modes
### Blocks
Blocks is the preferred and most efficient mode but is not yet compatible with all RPC providers/chains. To use it the RPC provider must support `eth_getBlockReceipts`.

Set `MODE="BLOCKS"` in `.env` to use blocks mode, make sure to read [Stateful Events](#StatefullEvents) and [Tokens](#Tokens) if it is the first run.

### Events
Events is the legacy mode but it is supported by all chains. Since this mode makes extra calls for each monitored event, monitoring a lot of events can be expensive/bring your node down.

Set `MODE="EVENTS"` in `.env` to use events mode.

### Switching
Switching modes is currently not automated but it is possible following the next steps

#### Events to Blocks
1. Make sure there are no backfills in process
2. Stop the Scraper
3. Delete the last `MAX_BLOCKS_REORG` blocks from the `blocks` table (just to be sure we are not skipping anything)
4. Change the mode to `BLOCKS`
5. Start the scraper


#### Blocks to Events
1. Stop the Scraper
2. For all the events being scraped upsert a row to `last_block_processed` with `last_processed_block_number` to the current max block number of the `blocks` table
3. Change the mode to `EVENTS`
4. Start the scraper


## Stateful Events (VIP)
Scraping some events (Uni v2 & Uni v3 VIP) depends on other events being already available in the DB (pool creation events).

When in `BLOCKS` mode this is not an issue as long as the scraping starts when the Uni Pool Factory was deployed, instead of when the EP was deployed. For now please copy the pool creation table from an existing source. Or use `EVENTS` mode (with fetching and saving blocks disabled) to backfill this events up to the point you want to start scraping the rest of the events.

When in `EVENTS` mode, do a first pass only scraping the pool creation events, up till where you want to start scraping the rest of the events.

Not backfilling the pool creation events before scraping VIP swaps will make the scrapers assume that all VIP swaps are spoofed (not from a real Pool) and ignore them.


## Tokens
To be able to get a complete list of tokens, the scrapers must process all blocks after the first ERC20 was deployed on the chain, this can take a lot of time and it is recommended to use the backfill feature.
