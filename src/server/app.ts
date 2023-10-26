import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import path from 'path';
import config from '../common/config';
import { sleep } from '../common/utils';
import { errorHandler, NotFoundError } from './errors';
import logger from './logger';
import { Sample } from './models/Sample';

const app = express();

app.use('/', express.static(path.join(__dirname, 'client')));
app.use(morgan('tiny', {
  stream: {
    write: (message) => logger.http(message),
  },
}));
app.get('/api/ping', (req, res) => {
  res.send(config.HELLO_WORLD);
});
app.get('/api/releaseInfo', (req, res) => {
  res.json({
    app: config.APP_NAME,
    version: config.APP_VERSION,
    hash: config.APP_HASH,
  });
});
app.get('/404', async () => {
  await sleep(10);
  throw new NotFoundError();
});
app.get('/api/sample', async (req, res) => {
  const sample = await Sample.findOne({});
  res.send(sample);
});

app.use(errorHandler);

export default app;
