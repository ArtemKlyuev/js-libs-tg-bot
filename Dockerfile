FROM node:18.16.1-slim as builder

ARG NODE_ENV
ARG NOTION_TOKEN
ARG NOTION_DATABASE_ID
ARG TELEGRAM_BOT_TOKEN
ARG TELEGRAM_VALID_USER_ID

WORKDIR /app-build

COPY ["package.json", "yarn.lock", "./"]

RUN yarn --frozen-lockfile --silent

COPY ./ ./

RUN yarn build

FROM node:18.16.1-slim as runner

WORKDIR /app

COPY --from=builder /app-build/package.json ./
COPY --from=builder /app-build/build ./build

RUN ls -a

CMD ["yarn", "start"]
