import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import session from 'express-session';
import memorystore from 'memorystore';
import filestore from 'session-file-store';
import { createTerminus } from '@godaddy/terminus';
import * as ViewController from './ViewController';
import * as ApiController from './ApiController';
import { PORT, ENV, getSecret, SecretName } from './config';

const app = express();

const jsonParser = bodyParser.json();

function setupStore() {
  if (ENV !== 'production') {
    const FileStore = filestore(session);
    return new FileStore({});
  }

  const MemoryStore = memorystore(session);
  return new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  });
}

async function setup(): Promise<void> {
  const sessionSecret = await getSecret(SecretName.SESSION_SECRET);
  app.use(
    session({
      cookie: { maxAge: 86400000 },
      store: setupStore(),
      secret: sessionSecret,
      resave: true,
      saveUninitialized: false,
    }),
  );

  app.use(morgan('dev'));
  app.use(jsonParser);
  app.set('view engine', 'pug');
  app.set('views', './views');

  app.use(express.static('public'));

  app.get('/', ViewController.indexView);
  app.get('/ping', (_, res) => res.send('pong'));
  app.get('/debug', ViewController.debug);
  app.get('/login', ViewController.login);
  app.get('/search', ViewController.searchView);
  app.get('/callback', ViewController.callbackView);

  app.post('/api/search', ApiController.searchHandler);
  app.all('/api/proxy/:endpoint*', ApiController.proxyHandler);

  function healthCheck(): Promise<string> {
    return Promise.resolve('hello world');
  }

  const server = http.createServer(app);
  createTerminus(server, {
    // health check options
    healthChecks: {
      '/healthcheck': healthCheck, // a function returning a promise indicating service health,
      verbatim: true, // [optional = false] use object returned from /healthcheck verbatim in response
    },
  });
  server.listen(PORT);
}

setup();
