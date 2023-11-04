import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import path from 'path';
import { IgResponseError } from 'instagram-private-api';
import fileUpload from 'express-fileupload';
import config from '../common/config';
import { sleep } from '../common/utils';
import { errorHandler, NotFoundError } from './errors';
import logger from './logger';
import { getIgClient } from './getIgClient';
import { getArchivedQAStories } from './getQA';
import { sampleQAStories } from '../common/sampleQAStories';

const app = express();

app.use(fileUpload());
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
      console.error('error in /api/stories', e);
      if (e instanceof IgResponseError) {
        logger.error(`error in /api/stories ${e.text}`);
        res.status(400).json({ message: e.text ?? 'IG cannot handle your request' });
      } else {
        logger.error(`error in /api/stories ${e}`);
        res.status(500).json({ message: 'Internal server error of IG Helper' });
      }
    });
});

app.post('/api/stories/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({ message: 'No files were uploaded.' });
    return;
  }
  const { image } = req.files;
  if (Array.isArray(image)) {
    res.status(401).json({ message: 'You may only upload a single file' });
    return;
  }
  const { username, password, otp } = req.body;
  console.log(image.data);
  getIgClient(username, password, otp)
    .then((ig) => ig.publish.story({ file: image.data }))
    .then(() => {
      res.status(200).json({ message: 'Uploaded story' });
    })
    .catch((e) => {
      console.log('error in /api/stories/upload', e);
      if (e instanceof IgResponseError) {
        console.log(e.response.body);
        logger.error(`error in /api/stories/upload ${e.text}`);
        res.status(400).json({ message: e.text ?? 'IG cannot handle your request' });
      } else {
        logger.error(`error in /api/stories/upload ${e}`);
        res.status(500).json({ message: 'Internal server error of IG Helper' });
      }
    });
});

app.post('/api/stories-sample', (req, res) => {
  res.json(sampleQAStories);
});

app.use(errorHandler);

export default app;
