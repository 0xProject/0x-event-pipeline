# 0x-event-pipeline

This repository contains two packages, `event-pipeline` and `api`. The `api` package is the 0x Staking API. The `event-pipeline` package began as a set of scripts to scrape staking-related Blockchain events, but has evolved to scrape events in general.

# Development

`yarn install && yarn build` from the root directory should build both packages.
To build a single package, run `yarn build` from within its package folder.

Alternatively, run `docker-compose up` to run all services together.
This will spin up the staking API, an event-pipeline scraper, and a backing postgres container.
You should then be able to navigate to http://localhost:4000/staking and use the Staking API.
You should also be able to connect to the postgres image to see the events stored.

```
psql postgresql://api:api@localhost/events
```

You can use this for testing each package separately by specifying the containers to run.
For example, if you are developing on the api package, you can start up just the event pipeline and postgres:

```
docker-compose up postgres events-pipeline
```

Then start the API:

```
cd packages/api && yarn dev
```
