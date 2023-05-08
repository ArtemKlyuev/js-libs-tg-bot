FROM node:16.17.1-alpine3.16 as builder

WORKDIR /app-build

COPY ["package.json", "yarn.lock", "./"]

RUN yarn --frozen-lockfile --silent

COPY ./ ./

RUN yarn build

FROM node:16.17.1-alpine3.16 as runner

WORKDIR /app

COPY --from=builder /app-build/package.json ./
COPY --from=builder /app-build/build ./build

CMD ["yarn", "start"]
