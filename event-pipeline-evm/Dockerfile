# Stage 1 - Build
#
FROM node:12-alpine AS build
WORKDIR /usr/src/app

# Install app dependencies
COPY event-pipeline-evm event-pipeline-evm
COPY pipeline-utils pipeline-utils
COPY package.json yarn.lock tsconfig.json lerna.json ./

RUN apk add --update --no-cache --virtual build-dependencies \
        bash \
        git \
        openssh \
        python3 \
        make \
        g++ && \
    yarn --frozen-lockfile --no-cache && \
    yarn build

# Stage 2
#
FROM node:12-alpine
WORKDIR /usr/src/app

# Setup monorepo
#
COPY package.json yarn.lock tsconfig.json lerna.json ./

# Setup pipeline-utils
#
COPY pipeline-utils/package.json pipeline-utils/
COPY --from=build /usr/src/app/pipeline-utils/lib pipeline-utils/lib

# Install event-pipeline-evm runtime dependencies
#
COPY event-pipeline-evm/package.json event-pipeline-evm/
RUN apk add --update --no-cache git && \
    yarn install --frozen-lockfile --no-cache --production && \
    yarn cache clean && \
    apk del git

# Copy built files
#
COPY --from=build /usr/src/app/event-pipeline-evm/lib event-pipeline-evm/lib/

# Start
#
WORKDIR /usr/src/app/event-pipeline-evm
CMD [ "yarn", "migrate_and_start" ]
