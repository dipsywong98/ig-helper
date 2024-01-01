import { AccountRepositoryCurrentUserResponseUser } from 'instagram-private-api';
import { IgSession, MfaDTO } from '../../common/DTO';

export interface IgClient {
  serialize(): Promise<IgSession>
  login(username: string, password: string): Promise<{ session: IgSession, mfa?: MfaDTO }>
  provideMfa(mfa: MfaDTO, code: string, trustThisDevice: boolean): Promise<{ session: IgSession }>
  me(): Promise<AccountRepositoryCurrentUserResponseUser>
}
