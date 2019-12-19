import { Request, Response } from 'express';
import got, { Method } from 'got';
import { API_HOST } from './config';

const httpClient = got.extend({
  prefixUrl: API_HOST,
  responseType: 'json',
});

type GenericError = {
  statusCode?: number;
  message?: string;
};

type SearchQuery = {
  queryString: string;
  startDate: number;
  limit: number;
  sort: string;
  order: string;
  categories: string[];
  offset?: number;
};

type IncomingBody = {
  category?: string;
  offset?: number;
} & SearchQuery;

function getDaysAgo(daysAgo: number): number {
  const d = new Date();
  d.setDate(d.getDate() + daysAgo * -1);
  return Math.floor(d.getTime() / 1000);
}

const defaultSearchQuery: SearchQuery = {
  queryString: '',
  startDate: getDaysAgo(180),
  limit: 100,
  sort: 'DATE',
  order: 'DESC',
  categories: [''],
};

function buildSearchBody(body: IncomingBody, defaults = defaultSearchQuery): SearchQuery {
  const { category, ...restBody } = body;
  const q = {
    ...defaults,
    categories: [category],
    ...restBody,
  };
  if (!q.queryString) {
    delete q.queryString;
  }
  if (!category) {
    delete q.categories;
  }
  return q;
}

function errorResponse(res: Response, err: GenericError, statusCode = 500): void {
  console.error('ERROR: ', err);
  res.status(statusCode).json({
    error: err.message,
  });
}

type Transaction = {};
type Result = {
  transaction: Transaction;
};

type SearchResponse = {
  count: number;
  net: number;
  results: Result[];
};

export const proxyHandler = async (req: Request, res: Response): Promise<any> => {
  const isPostRequest = req.method === 'POST';
  try {
    let apiEndpoint = req.params.endpoint;
    if (req.params[0]) {
      apiEndpoint += req.params[0];
    }
    const method: Method = (req.method as Method) || 'GET';
    const contentType = req.get('Content-Type') || 'application/json';
    const { token } = req.cookies;
    // console.log('>>> Method: ', method);
    // console.log('>>> Endpoint: ', apiEndpoint);
    // console.log('>>> Content-Type: ', contentType);
    // console.log('>>> Body: ', req.body);
    const apiResponse = await httpClient(apiEndpoint, {
      method,
      headers: {
        'Content-Type': contentType,
        Authorization: `Bearer ${token}`,
      },
      ...(isPostRequest ? { json: req.body } : {}),
    });
    res.type('application/json').send(apiResponse.body);
  } catch (err) {
    errorResponse(res, err);
  }
};

export const searchHandler = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.cookies;

  if (!token) {
    errorResponse(res, new Error('Missing token'), 401);
  }

  const q = buildSearchBody(req.body);
  try {
    const searchResult = await httpClient.post<SearchResponse>('search', {
      json: q,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseBody = searchResult.body;
    const { results } = responseBody;

    res.json({
      ...responseBody,
      results: results.map((r: any) => ({
        ...r.transaction,
      })),
    });
  } catch (err) {
    errorResponse(res, err);
  }
};
