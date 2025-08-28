FROM node:24-alpine

RUN apk add --no-cache bash

WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .
COPY prisma ./prisma

RUN npx prisma generate
RUN npm run build

EXPOSE 3001

COPY wait-for-db.sh /app/wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

CMD ["/bin/bash", "/app/wait-for-db.sh"]