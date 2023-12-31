import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import path from 'path';
import { IgResponseError, IgApiClient } from 'instagram-private-api';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import config from '../common/config';
import { sleep } from '../common/utils';
import { errorHandler, NotFoundError } from './errors';
import logger from './logger';
import { getIgClient } from './getIgClient';
import { getArchivedQAStories } from './getQA';
import { sampleQAStories } from '../common/sampleQAStories';
import { MfaDTO } from '../common/DTO';
import authRouter from './auth/authRouter';

const app = express();

declare module 'express-session' {
  interface SessionData {
    username: string
    igSession: string
    mfa: MfaDTO
    logedIn: boolean
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      ig: IgApiClient
    }
  }
}

app.use(session({ secret: 'keyboard cat', cookie: { secure: app.get('env') === 'production' } }));
app.use(fileUpload());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'client')));
app.use(morgan('tiny', {
  stream: {
    write: (message) => logger.http(message),
  },
}));
app.use(async (req, res, next) => {
  const ig = new IgApiClient();
  if (req.session.username) {
    ig.state.generateDevice(req.session.username);
  }
  if (req.session.igSession) {
    await ig.state.deserialize(req.session.igSession);
  }
  res.locals.ig = ig;
  next();
});
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

app.use(authRouter);

app.use((req, res, next) => {
  if (!req.session.logedIn) {
    res.status(401).json({ error: 'NOT_LOGGED_IN' });
    return;
  }
  next();
});

app.get('/api/my/self', async (req, res) => {
  const { ig } = res.locals;
  ig.account.currentUser().then((result) => res.json(result));
});

app.use(errorHandler);

export default app;
