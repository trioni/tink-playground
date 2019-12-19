# Tink Playground

Explore open banking APIs by accessing your bank accounts via the Tink API

## Prerequisites

- [Node](https://nodejs.org/en/) ^v10.16
- [Yarn](https://yarnpkg.com/lang/en/) or `npm`

## Stack

- Express
- Pug
- Vue

## Getting started

- Login to the [Tink Console](https://console.tink.com)
- Go to "App Settings"
  - Copy the `Client ID` and `Client secret`
  - Make sure that you have `http://localhost:1337/callback` in "Redirect URIs". If not any login will fail
- Create an `.env` file by running the command `cp .env.example .env`
- Replace the `NODE_CLIENT_ID` and `NODE_CLIENT_SECRET` with the `Client ID` and `Client secret` from the Console



```bash
# install dependencies
yarn

# start the server in dev mode
yarn dev
```

Visit `http://localost:1337` in your browser
