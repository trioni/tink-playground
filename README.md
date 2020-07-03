# Tink Playground

Explore open banking APIs by accessing your bank accounts via the Tink API

## Prerequisites

- [Node](https://nodejs.org/en/) ^v12.16
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
- Replace: 
  - `NODE_CLIENT_ID` with the `Client ID` from the Console
  - `NODE_CLIENT_SECRET` with the `Client secret` from the Console
  - `NODE_SESSION_SECRET` generate a uuid at https://www.uuidgenerator.net/


```bash
# install dependencies
yarn

# start the server in dev mode
yarn dev
```

Visit `http://localhost:1337` in your browser

## Running in GCP

Using [Cloud Run](https://cloud.google.com/run)

Environment variables:
`NODE_REDIRECT_URI` - should match your domain and be registered for your app in the Tink Console
`NODE_SECRETS_VERSION` - a [secrets manager](https://cloud.google.com/secret-manager) secret version. Should look something like `projects/:project/secrets/:secretName/versions/:n`

The value of the secret should be a JSON like:

```json
{
  "clientId": "<client_id>",
  "clientSecret": "<client_secret>",
  "sessionSecret": "<session_secret>"
}
```

### Deploy using the gcloud cli

```bash
gcloud builds submit --tag gcr.io/:project/:serviceName

gcloud run deploy --image gcr.io/:project/:serviceName --platform managed
```
