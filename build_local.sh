#!/usr/bin/env sh

docker-compose -f docker-compose.yml up -d postgres
docker-compose -f docker-compose.yml build event-pipeline-ethereum

# `-f docker-compose.dev.yml` add environment variables for testing
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up event-pipeline-ethereum