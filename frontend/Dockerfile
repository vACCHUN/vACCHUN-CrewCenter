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

RUN npm run build:prod

FROM base AS buildstaging

RUN npm run build:staging


### PROD ###
FROM nginx:1.29 AS prodbase

RUN rm /etc/nginx/conf.d/default.conf


FROM prodbase AS prod

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM prodbase AS staging

COPY nginx/nginx.staging.conf /etc/nginx/conf.d/default.conf
COPY --from=buildstaging /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]