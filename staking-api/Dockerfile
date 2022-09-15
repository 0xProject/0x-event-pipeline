# Stage 1
FROM node:12-alpine as build

WORKDIR /usr/src/app
# Install app dependencies
COPY staking-api staking-api
COPY package.json yarn.lock tsconfig.json lerna.json ./

RUN apk add --update --no-cache --virtual build-dependencies \
        bash \
        git \
        openssh \
        python3 \
        make \
        g++ && \
    yarn --frozen-lockfile --no-cache

RUN yarn build

# Stage 2
FROM node:12-alpine
WORKDIR /usr/src/app

# Skip dev dependencies
ENV NODE_ENV=production

# Install runtime dependencies
COPY staking-api/package.json yarn.lock ./

RUN yarn install --frozen-lockfile && \
    yarn cache clean

# Copy built files
COPY --from=build /usr/src/app/staking-api/lib /usr/src/app/staking-api/lib

EXPOSE 4000
CMD ["node", "/usr/src/app/staking-api/lib/src/index.js"]
