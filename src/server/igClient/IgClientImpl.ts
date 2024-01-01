import { AccountRepositoryCurrentUserResponseUser, IgApiClient, IgLoginTwoFactorRequiredError } from 'instagram-private-api';
import { IgSession, MfaDTO } from '../../common/DTO';
import { IgClient } from './IgClient';

export default class IgClientImpl implements IgClient {
  private ig: IgApiClient;

  private constructor() {
    this.ig = new IgApiClient();
  }

  static async create(session?: IgSession, username?: string): Promise<IgClientImpl> {
    const client = new IgClientImpl();
    if (username) {
      client.ig.state.generateDevice(username);
    }
    await client.ig.state.deserialize(session);
    return client;
  }

  async serialize() {
    return this.ig.state.serialize();
  }

  async login(username: string, password: string) {
    try {
      await this.ig.account.login(username, password);
      return {
        session: await this.ig.state.serialize(),
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
          session: await this.ig.state.serialize(),
          mfa: {
            username,
            totp_two_factor_on,
            two_factor_identifier,
          },
        };
      }
      throw e;
    }
  }

  async provideMfa(mfa: MfaDTO, code: string, trustDevice: boolean) {
    const verificationMethod = mfa.totp_two_factor_on ? '0' : '1'; // default to 1 for SMS
    await this.ig.account.twoFactorLogin({
      username: mfa.username,
      verificationCode: code,
      twoFactorIdentifier: mfa.two_factor_identifier,
      verificationMethod, // '1' = SMS (default), '0' = TOTP (google auth for example)
      trustThisDevice: trustDevice ? '1' : '0', // Can be omitted as '1' is used by default
    });
    return {
      session: await this.ig.state.serialize(),
    };
  }

  async me(): Promise<AccountRepositoryCurrentUserResponseUser> {
    return this.ig.account.currentUser();
  }
}
