# Stage 1 - Build
FROM node:12-alpine as build
WORKDIR /usr/src/app

# Install app dependencies
COPY event-pipeline-bsc event-pipeline-bsc
COPY pipeline-utils pipeline-utils
COPY package.json yarn.lock tsconfig.json lerna.json ./
RUN apk update && \
    apk upgrade && \
    apk add --no-cache --virtual build-dependencies bash git openssh python make g++ && \
    yarn --frozen-lockfile --no-cache
    
RUN yarn build

# Stage 2
FROM node:12-alpine
WORKDIR /usr/src/app

# Setup monorepo
COPY package.json yarn.lock tsconfig.json lerna.json ./

# Setup pipeline-utils
COPY pipeline-utils/package.json pipeline-utils/
COPY --from=build /usr/src/app/pipeline-utils/lib pipeline-utils/lib

# Install event-pipeline-bsc runtime dependencies
COPY event-pipeline-bsc/package.json event-pipeline-bsc/
RUN apk add git && \
    yarn install --frozen-lockfile --no-cache --production && \
    apk del git

# Copy built files
COPY --from=build /usr/src/app/event-pipeline-bsc/lib event-pipeline-bsc/lib/

#Start
WORKDIR /usr/src/app/event-pipeline-bsc
CMD [ "yarn", "migrate_and_start" ]
