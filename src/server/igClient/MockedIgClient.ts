import { AccountRepositoryCurrentUserResponseUser } from 'instagram-private-api';
import { IgSession, MfaDTO } from '../../common/DTO';
import { IgClient } from './IgClient';
import me from './samples/me.json';

export const MOCKED_CLIENT_SESSION = Object.freeze({ session: 'mocked' });

export default function getMockedClient(): IgClient {
  const client: IgClient = {
    serialize(): Promise<IgSession> {
      return Promise.resolve(MOCKED_CLIENT_SESSION);
    },
    login(): Promise<{ session: IgSession; mfa?: MfaDTO; }> {
      return Promise.resolve({
        session: MOCKED_CLIENT_SESSION,
      });
    },
    provideMfa(): Promise<{ session: IgSession; }> {
      return Promise.resolve({
        session: MOCKED_CLIENT_SESSION,
      });
    },
    me(): Promise<AccountRepositoryCurrentUserResponseUser> {
      return Promise.resolve(me);
    },
  };
  return client;
}
