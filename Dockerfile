# Stage 1 - Build
#
FROM node:16-alpine as build
WORKDIR /usr/src/app

RUN apk add --update --no-cache --virtual \
            git \
            python3 \
            make

COPY package.json tsconfig.json yarn.lock ./
RUN yarn install --frozen-lockfile --no-cache

COPY migrations migrations
COPY src src

#Start
#
RUN yarn build

# Stage 2 - Runner
#
FROM node:16-alpine
WORKDIR /usr/src/app

COPY package.json tsconfig.json yarn.lock ./

RUN apk add  --update --no-cache git && \
    yarn install --frozen-lockfile --no-cache --production && \
    yarn cache clean && \
    apk del git

# Copy built files
#
COPY --from=build /usr/src/app/lib ./lib/

# Start
#
CMD [ "yarn", "migrate_and_start" ]
