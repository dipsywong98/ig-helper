/* tslint:disable:no-console */
import { IgApiClient } from 'instagram-private-api';

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
    return client;
  }
  const ig = new IgApiClient();
  logger.info('loggin in ', username);
  ig.state.generateDevice(sha(username));
  await ig.account.login(username, password);
  logger.info('successfully login');
  cache.set(key, ig);
  return ig;
};
