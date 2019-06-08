FROM keymetrics/pm2:latest-alpine

WORKDIR /database

RUN touch ./db.sqlite

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ADD . .

RUN npm run db:migrate
