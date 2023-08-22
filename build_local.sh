#!/usr/bin/env sh

docker-compose -f docker-compose.yml up -d postgres
docker-compose -f docker-compose.yml build event-pipeline-ethereum
docker-compose -f docker-compose.yml up event-pipeline-ethereum

# docker-compose -f docker-compose.yml build token-scraper-ethereum
# docker-compose -f docker-compose.yml up token-scraper-ethereum
