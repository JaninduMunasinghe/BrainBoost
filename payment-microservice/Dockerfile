FROM node:lts-alpine as builder
ARG NODE_ENV
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]