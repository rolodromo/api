FROM node:10-alpine

RUN apk add --no-cache bash grep coreutils jq

WORKDIR /app

COPY package*.json ./
COPY .babelrc ./
COPY src ./src
COPY config ./config

RUN npm install && npm run build

RUN rm .babelrc src -rf && npm prune --production && npm audit fix

ENV NODE_ENV production
EXPOSE 3001

CMD  ["node", "lib/start.js"]
