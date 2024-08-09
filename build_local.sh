#!/usr/bin/env sh

docker-compose -f docker-compose-dev.yml build event-pipeline-ethereum
docker-compose -f docker-compose-dev.yml build event-pipeline-base

# `-f docker-compose.dev.yml` add environment variables for testing
docker-compose -f docker-compose-dev.yml up event-pipeline-ethereum

docker-compose -f docker-compose-dev.yml build token-scraper-ethereum

# `-f docker-compose.dev.yml` add environment variables for testing
docker-compose -f docker-compose-dev.yml up token-scraper-ethereum
