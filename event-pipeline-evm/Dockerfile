# Stage 1 - Build
FROM node:16-alpine as build
WORKDIR /usr/src/app

RUN apk add git python3 make

COPY package.json tsconfig.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY migrations migrations
COPY src src

#Start
RUN yarn build

# Stage 2 - Runner
FROM node:16-alpine
WORKDIR /usr/src/app

RUN apk add git

COPY package.json tsconfig.json yarn.lock ./

RUN yarn install --frozen-lockfile --no-cache --production

# Copy built files
COPY --from=build /usr/src/app/lib ./lib/


CMD [ "yarn", "migrate_and_start" ]
