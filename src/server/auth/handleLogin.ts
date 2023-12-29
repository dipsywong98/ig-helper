import { IgApiClient, IgLoginTwoFactorRequiredError } from 'instagram-private-api';
import { LoginResponseDTO } from '../../common/DTO';
import logger from '../logger';

async function handleLogin(username: string, password: string): Promise<LoginResponseDTO> {
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
          username,
          totp_two_factor_on,
          two_factor_identifier,
        },
        logedIn: false,
      };
    }
    console.log(e);
    throw e;
  }
}

export default handleLogin;
