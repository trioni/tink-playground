import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

// Value used during development
export const CLIENT_ID = process.env.NODE_CLIENT_ID;
export const CLIENT_SECRET = process.env.NODE_CLIENT_SECRET;
export const REDIRECT_URI = process.env.NODE_REDIRECT_URI;

// Value used in production
export const SECRETS_VERSION = process.env.NODE_SECRETS_VERSION;
export const ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 1337;
export const API_HOST = 'https://api.tink.com/api/v1';
export const SESSION_SECRET = process.env.NODE_SESSION_SECRET;

export enum SecretName {
  CLIENT_ID = 'clientId',
  CLIENT_SECRET = 'clientSecret',
  SESSION_SECRET = 'sessionSecret',
}

const secretsMapping = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  sessionSecret: SESSION_SECRET,
};

const fetchedSecrets: Record<SecretName, string> = {
  clientId: undefined,
  clientSecret: undefined,
  sessionSecret: undefined,
};

export async function getSecret(secretName: SecretName): Promise<string> {
  if (ENV !== 'production') {
    return Promise.resolve(secretsMapping[secretName]);
  }

  if (!SECRETS_VERSION) {
    throw new Error('SECRETS_VERSION is missing');
  }

  if (fetchedSecrets[secretName]) {
    return fetchedSecrets[secretName];
  }

  const [secretVersion] = await client.accessSecretVersion({
    name: SECRETS_VERSION,
  });

  const remoteSecrets = JSON.parse(secretVersion.payload.data.toString());
  Object.keys(remoteSecrets).forEach(key => {
    fetchedSecrets[key as SecretName] = remoteSecrets[key];
  });

  return fetchedSecrets[secretName];
}

export const MARKET_OPTIONS = [
  {
    value: 'AT',
    label: 'Autstria',
  },
  {
    value: 'BE',
    label: 'Belgium',
  },
  {
    value: 'DK',
    label: 'Denmark',
  },
  {
    value: 'FI',
    label: 'Finland',
  },
  {
    value: 'DE',
    label: 'Germany',
  },
  {
    value: 'IT',
    label: 'Italy',
  },
  {
    value: 'NL',
    label: 'Netherlands',
  },
  {
    value: 'NO',
    label: 'Norway',
  },
  {
    value: 'PT',
    label: 'Portugal',
  },
  {
    value: 'ES',
    label: 'Spain',
  },
  {
    value: 'SE',
    label: 'Sweden',
  },
  {
    value: 'GB',
    label: 'United Kingdom',
  },
];
