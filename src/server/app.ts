import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import path from 'path';
import { IgResponseError } from 'instagram-private-api';
import config from '../common/config';
import { sleep } from '../common/utils';
import { errorHandler, NotFoundError } from './errors';
import logger from './logger';
import { getIgClient } from './getIgClient';
import { getArchivedQAStories } from './getQA';
import { sampleQAStories } from '../common/sampleQAStories';

const app = express();

app.use(express.json());
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

app.post('/api/stories', (req, res) => {
  const { username, password, otp } = req.body;
  getIgClient(username, password, otp)
    .then(getArchivedQAStories)
    .then((qa) => {
      res.json(qa);
      return qa;
    })
    .catch((e) => {
      if (e instanceof IgResponseError) {
        logger.error(`error in /api/stories ${e.text}`);
        res.status(400).json({ message: e.text });
      } else {
        logger.error(`error in /api/stories ${e}`);
        logger.error(e);
        res.status(500).json({ message: 'Internal server error of IG Helper' });
      }
    });
});

app.post('/api/stories-sample', (req, res) => {
  res.json(sampleQAStories);
});

app.use(errorHandler);

export default app;
