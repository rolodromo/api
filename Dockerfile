FROM node:10-alpine

RUN apk add --no-cache bash grep coreutils jq

WORKDIR /app

COPY package*.json ./
COPY .babelrc ./
COPY src ./src
COPY config ./config

RUN npm ci && npm run build

COPY src/views lib/views

RUN rm .babelrc src -rf && npm prune --production

ENV NODE_ENV production
EXPOSE 3001

CMD  ["node", "lib/start.js"]
