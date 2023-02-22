# 0x-event-pipeline

EVM Blockchain Scraper, mainly for 0x Protocol Events and some extra useful Events.

## Getting started

Run locally:

1. Copy the `.env.exmaple` file to `.env`. Add the `RPC_URL` for the chain(s) you are going to run

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
