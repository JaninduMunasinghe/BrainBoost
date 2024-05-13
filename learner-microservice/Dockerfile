FROM node:lts-alpine as builder
ARG NODE_ENV
ENV NODE_ENV=development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]