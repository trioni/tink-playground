import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import * as ViewController from './ViewController';
import * as ApiController from './ApiController';
import { PORT } from './config';

const app = express();

const jsonParser = bodyParser.json();

app.use(morgan('dev'));
app.use(jsonParser);
app.use(cookieParser());
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', ViewController.indexView);
app.get('/login', ViewController.login);
app.get('/search', ViewController.searchView);
app.get('/callback', ViewController.callbackView);

app.post('/api/search', ApiController.searchHandler);
app.all('/api/proxy/:endpoint*', ApiController.proxyHandler);

app.listen(PORT, () => {
  console.log('listening at port: ', PORT);
});
