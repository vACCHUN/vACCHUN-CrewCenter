### BASE ###
FROM node:25.3 AS base
WORKDIR /app

COPY ./package-lock.json ./package.json ./

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 4000


### DEV ###
FROM base AS dev

CMD ["npm", "run", "dev"]

### PROD ###
FROM base AS prod


CMD ["npm", "run", "start"]