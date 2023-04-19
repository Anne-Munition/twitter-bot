FROM node:18.16.0-alpine3.16 as base
WORKDIR /app

FROM base AS prod_dependencies
COPY package.json yarn.lock ./
RUN yarn --production=true

FROM prod_dependencies as dev_dependencies
RUN yarn --production=false

FROM dev_dependencies AS builder
COPY . .
RUN yarn prettier && \
    yarn lint && \
    yarn test && \
    yarn build

FROM base
ENV DOCKER=true \
    NODE_ENV=production
#COPY package.json .
COPY --from=prod_dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENTRYPOINT ["node", "/app/dist/index.js"]
