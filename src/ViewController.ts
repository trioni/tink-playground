import { Request, Response } from 'express';
import got from 'got';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, API_HOST, MARKET_OPTIONS } from './config';

const httpClient = got.extend({
  prefixUrl: API_HOST,
  responseType: 'json',
});

const scopes = [
  'statistics:read',
  'accounts:read',
  'transactions:read',
  'user:read',
  'accounts:read',
  'investments:read',
  'identity:read',
];

export function indexView(req: Request, res: Response): void {
  res.render('index', { marketOptions: MARKET_OPTIONS });
}

export function debug(req: Request, res: Response): void {
  res.json({ REDIRECT_URI, API_HOST });
}

export function login(req: Request, res: Response): void {
  const tinkLinkUrl = `https://link.tink.com/1.0/authorize/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&market=${
    req.query.market
  }&scope=${scopes.join(',')}${req.query.test === 'test' ? '&test=true' : ''}`;
  res.redirect(tinkLinkUrl);
}

export function searchView(req: Request, res: Response): void {
  res.render('search', {
    count: 0,
    data: [],
  });
}

type TokenResponse = {
  access_token: string;
};

async function exchangeCodeForToken(code: string) {
  const tokenResult = await httpClient.post<TokenResponse>('oauth/token', {
    form: {
      code: code,
      /* eslint-disable @typescript-eslint/camelcase */
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
    },
  });
  const { access_token } = tokenResult.body;
  if (!access_token) {
    console.error('No token', tokenResult);
    throw new Error('No token');
  }
  return access_token;
}

export async function callbackView(req: Request, res: Response): Promise<void> {
  const { code, error, message } = req.query;

  if (error) {
    res.status(400).render('error', { error: message });
  }

  try {
    const accessToken = await exchangeCodeForToken(code);
    req.session.token = accessToken;
    res.redirect('/search');
  } catch (err) {
    console.error('CallbackError: ', err);
    res.status(500).render('error', { error: err.message });
  }
}
