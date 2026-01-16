### BASE ###
FROM node:25.3 AS base

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . .


### DEV ###
FROM base AS dev
EXPOSE 5173

CMD ["npm", "run", "dev"]

### BUILD ###
FROM base AS build

RUN npm run build

### PROD ###
FROM nginx:1.29 AS prod

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]