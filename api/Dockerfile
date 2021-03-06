# Stage 1
FROM node:12-alpine as yarn-install
WORKDIR /usr/src/app
# Install app dependencies
COPY api/package.json .
COPY yarn.lock .
RUN apk update && \
    apk upgrade && \
    apk add --no-cache --virtual build-dependencies git && \
    yarn --frozen-lockfile --no-cache && \
    apk del build-dependencies && \
    yarn cache clean

# Runtime container with minimal dependencies
FROM node:12-alpine

RUN apk update && \
    apk upgrade && \
    apk add ca-certificates

WORKDIR /usr/src/app
COPY --from=yarn-install /usr/src/app/node_modules /usr/src/app/node_modules
# Bundle app source
COPY api .

WORKDIR /usr/src/app/api
RUN yarn build

EXPOSE 4000
CMD [ "node", "lib/src/index.js" ]
