FROM node:12.18.0-alpine
# Create app directory
WORKDIR /usr/src/app
COPY . .

RUN yarn install && yarn build

EXPOSE 1337
CMD ["yarn", "start"]
