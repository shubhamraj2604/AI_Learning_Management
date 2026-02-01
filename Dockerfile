# base image : providing a node enviornment for my nextjs app to build
FROM node:20-alpine

# This is my Working directory insider docker
WORKDIR /app

COPY package.json package-lock.json* ./

# This is used to re-download if there is change in dependencies otherwise uses caching.
RUN npm ci

# Copies ALL dependencies
COPY . .

# Build the nextjs app
RUN npm run build

EXPOSE 3000

CMD [ "npm" , "start"]

