import type { IgApiClient } from 'instagram-private-api';
import { MfaDTO } from '../../common/DTO';
import logger from '../logger';

async function handleMfa(ig: IgApiClient, mfa: MfaDTO, code: string): Promise<void> {
  logger.info(`dealing with 2fa for ${mfa.username}`);
  const verificationMethod = mfa.totp_two_factor_on ? '0' : '1'; // default to 1 for SMS
  await ig.account.twoFactorLogin({
    username: mfa.username,
    verificationCode: code,
    twoFactorIdentifier: mfa.two_factor_identifier,
    verificationMethod, // '1' = SMS (default), '0' = TOTP (google auth for example)
    trustThisDevice: '1', // Can be omitted as '1' is used by default
  });
}

export default handleMfa;
