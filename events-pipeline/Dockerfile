# Stage 1
FROM node:12-alpine as build
WORKDIR /usr/src/app

# Install app dependencies
COPY events-pipeline events-pipeline
COPY package.json yarn.lock tsconfig.json lerna.json ./
RUN apk update && \
    apk upgrade && \
    apk add --no-cache --virtual build-dependencies bash git openssh python make g++ && \
    yarn --frozen-lockfile --no-cache
    
RUN yarn build

# Stage 2
FROM node:12-alpine
WORKDIR /usr/src/app

# Skip dev dependencies
ENV NODE_ENV=production

# Install runtime dependencies
COPY events-pipeline/package.json yarn.lock ./
RUN apk add git
RUN yarn install --frozen-lockfile --no-cache

# Copy built files
COPY --from=build /usr/src/app/events-pipeline/lib /usr/src/app/lib

EXPOSE 3000
CMD [ "yarn", "migrate_and_start" ]
