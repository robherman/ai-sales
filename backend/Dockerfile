FROM node:21-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production
COPY . .
RUN npm install
RUN npm run build

CMD ["npm", "run", "start:prod"]