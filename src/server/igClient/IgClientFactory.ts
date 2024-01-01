import config from '../../common/config';
import { IgSession } from '../../common/DTO';
import { IgClient } from './IgClient';
import IgClientImpl from './IgClientImpl';
import getMockedClient, { MOCKED_CLIENT_SESSION } from './MockedIgClient';

async function createIgClient(session?: IgSession, username?: string): Promise<IgClient> {
  if (!config.CONNECT_TO_IG) {
    return getMockedClient();
  }
  if (session.session === MOCKED_CLIENT_SESSION.session) {
    return IgClientImpl.create(undefined, username);
  }
  return IgClientImpl.create(session, username);
}

export default createIgClient;
