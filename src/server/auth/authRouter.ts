import { Router } from 'express';
import { IgApiClient } from 'instagram-private-api';
import handleLogin from './handleLogin';
import handleMfa from './handleMfa';

const authRouter = Router();

authRouter.post('/api/login', async (req, res) => {
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

authRouter.post('/api/loginWithSession', async (req, res) => {
  const { igSession, username } = req.body;
  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  await ig.state.deserialize(igSession);
  await ig.account.currentUser();
  req.session.regenerate(async () => {
    req.session.username = username;
    req.session.igSession = igSession;
    req.session.logedIn = true;
    res.json({
      session: await ig.state.serialize(),
    });
  });
});

authRouter.post('/api/provideMFA', async (req, res) => {
  const { ig } = res.locals;
  const { mfa, username } = req.session;
  const { code, trustThisDevice } = req.body;
  if (!mfa || !username) {
    res.status(401).json({ error: 'NO_PENDING_MFA' });
    return;
  }
  handleMfa(ig, mfa, code, trustThisDevice).then((result) => {
    req.session.logedIn = true;
    req.session.mfa = undefined;
    res.json(result);
  });
});

authRouter.post('/api/logout', (req, res) => {
  req.session.regenerate(() => {
    res.json({ message: 'success' });
  });
});

export default authRouter;
