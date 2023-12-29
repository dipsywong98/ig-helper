import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import path from 'path';
import { IgResponseError, IgApiClient, IgLoginTwoFactorRequiredError } from 'instagram-private-api';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import config from '../common/config';
import { sleep } from '../common/utils';
import { errorHandler, NotFoundError } from './errors';
import logger from './logger';
import { getIgClient } from './getIgClient';
import { getArchivedQAStories } from './getQA';
import { sampleQAStories } from '../common/sampleQAStories';
import { LoginResponseDTO, MfaDTO, MfaResponseDTO } from '../common/DTO';

const app = express();

declare module 'express-session' {
  interface SessionData {
    username: string
    igSession: string
    mfa: {
      totp_two_factor_on: boolean
      two_factor_identifier: string
    }
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

const handleLogin = async (username: string, password: string): Promise<LoginResponseDTO> => {
  const ig = new IgApiClient();
  logger.info(`loggin in ${username} to generate session id`);
  ig.state.generateDevice(username);
  try {
    await ig.account.login(username, password);
    return {
      session: await ig.state.serialize(),
      logedIn: true,
    };
  } catch (e) {
    if (e instanceof IgLoginTwoFactorRequiredError) {
      const {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        totp_two_factor_on,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        two_factor_identifier,
      } = e.response.body.two_factor_info;
      return {
        session: await ig.state.serialize(),
        mfa: {
          totp_two_factor_on,
          two_factor_identifier,
        },
        logedIn: false,
      };
    }
    console.log(e);
    throw e;
  }
  logger.info('successfully login');
};

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await handleLogin(username, password);
  req.session.regenerate(() => {
    req.session.username = username;
    req.session.igSession = result.session;
    req.session.mfa = result.mfa;
    req.session.logedIn = true;
    res.json(result);
  });
});

app.post('/api/loginWithSession', async (req, res) => {
  const { igSession, username } = req.body;
  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  await ig.state.deserialize(igSession);
  const user = await ig.account.currentUser();
  req.session.regenerate(() => {
    req.session.username = username;
    req.session.igSession = igSession;
    req.session.logedIn = true;
    res.json(user);
  });
});

const handleMfa = async (ig: IgApiClient, username: string, mfa: MfaDTO, code: string): Promise<void> => {
  logger.info(`dealing with 2fa for ${username}`);
  const verificationMethod = mfa.totp_two_factor_on ? '0' : '1'; // default to 1 for SMS
  await ig.account.twoFactorLogin({
    username,
    verificationCode: code,
    twoFactorIdentifier: mfa.two_factor_identifier,
    verificationMethod, // '1' = SMS (default), '0' = TOTP (google auth for example)
    trustThisDevice: '1', // Can be omitted as '1' is used by default
  });
};

app.post('/api/provideMFA', async (req, res) => {
  const { ig } = res.locals;
  const { mfa, username } = req.session;
  const { code } = req.body;
  if (!mfa || !username) {
    res.status(401).json({ error: 'NO_PENDING_MFA' });
    return;
  }
  handleMfa(ig, username, mfa, code).then(() => {
    req.session.logedIn = true;
    req.session.mfa = undefined;
    res.json({ success: true });
  });
});

app.use((req, res, next) => {
  if (!req.session.logedIn) {
    res.status(401).json({ error: 'NOT_LOGGED_IN' });
    return;
  }
  next();
});

app.get('/api/me', async (req, res) => {
  const { ig } = res.locals;
  ig.account.currentUser().then((result) => res.json(result));
  // const { mfa, username } = req.session;
  // const { code } = req.body;
  // handleMfa(ig, username, mfa, code).then(() => {
  //   res.json({ success: true });
  // });
});

app.use(errorHandler);

export default app;
