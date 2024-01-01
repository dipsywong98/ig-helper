import { Router } from 'express';
import createIgClient from '../igClient/IgClientFactory';

const authRouter = Router();

authRouter.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await res.locals.ig.login(username, password);
  req.session.regenerate(() => {
    req.session.username = username;
    req.session.igSession = result.session;
    req.session.mfa = result.mfa;
    req.session.logedIn = !result.mfa;
    res.json(result);
  });
});

authRouter.post('/api/loginWithSession', async (req, res) => {
  const { igSession, username } = req.body;
  const ig = await createIgClient(igSession, username);
  await ig.me();
  // const ig = new IgApiClient();
  // ig.state.generateDevice(username);
  // await ig.state.deserialize(igSession);
  req.session.regenerate(async () => {
    req.session.username = username;
    req.session.igSession = await ig.serialize();
    req.session.logedIn = true;
    res.json({
      session: await ig.serialize(),
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
  const result = await ig.provideMfa(mfa, code, trustThisDevice);
  req.session.logedIn = true;
  req.session.mfa = undefined;
  res.json(result);
});

authRouter.post('/api/logout', (req, res) => {
  req.session.regenerate(() => {
    res.json({ message: 'success' });
  });
});

export default authRouter;
