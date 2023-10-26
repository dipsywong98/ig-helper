import { Sample } from '../../src/server/models/Sample';
import { request } from './common';

describe('app', () => {
  describe('GET /api/ping', () => {
    it('responses with hello world', async () => {
      const res = await request.get('/api/ping');
      expect(res.text).toEqual('hello world');
      expect(res.ok).toBeTruthy();
    });
  });
  describe('GET /404', () => {
    it('responses with not found', async () => {
      const res = await request.get('/404');
      expect(res.body).toEqual({ message: 'Not Found' });
      expect(res.statusCode).toEqual(404);
    });
  });
  describe('GET /api/sample', () => {
    it('return the sample message', async () => {
      await Sample.insertMany([{ message: 'some message' }]);
      const res = await request.get('/api/sample');
      expect(res.body).toEqual(expect.objectContaining({
        message: 'some message',
      }));
      expect(res.ok).toBeTruthy();
    });
  });
});
