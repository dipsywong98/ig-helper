/* tslint:disable:no-console */
import { IgApiClient, IgLoginTwoFactorRequiredError } from 'instagram-private-api';

import { LRUCache } from 'lru-cache';

import { createHash } from 'crypto';
import logger from './logger';

const sha = (original: string) => createHash('sha256').update(`zumsot-${original}`).digest('base64');

const options = {
  max: 10,

  // how long to live in ms
  ttl: 1000 * 60 * 60 * 24,

  // return stale items before removing from cache?
  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,
};

const cache = new LRUCache<string, IgApiClient>(options);

export const getIgClient = async (username: string, password: string, otp?: string) => {
  const key = sha(`${username}:${password}`);
  const client = cache.get(key);
  if (client) {
    logger.info(`using cached ig client instance of ${username}`);
    return client;
  }
  const ig = new IgApiClient();
  logger.info(`loggin in ${username}`);
  ig.state.generateDevice(username);
  try {
    await ig.account.login(username, password);
  } catch (e) {
    if (e instanceof IgLoginTwoFactorRequiredError) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        username,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        totp_two_factor_on,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        two_factor_identifier,
      } = e.response.body.two_factor_info;
      logger.info(`dealing with 2fa for ${username}`);
      const verificationMethod = totp_two_factor_on ? '0' : '1'; // default to 1 for SMS
      await ig.account.twoFactorLogin({
        username,
        verificationCode: otp,
        twoFactorIdentifier: two_factor_identifier,
        verificationMethod, // '1' = SMS (default), '0' = TOTP (google auth for example)
        trustThisDevice: '1', // Can be omitted as '1' is used by default
      });
    } else {
      console.log(e);
      throw e;
    }
  }
  logger.info('successfully login');
  cache.set(key, ig);
  return ig;
};
