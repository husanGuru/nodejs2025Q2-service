FROM node:alpine

WORKDIR /app

EXPOSE 4000

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh
