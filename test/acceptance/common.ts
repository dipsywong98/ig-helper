import stoppable from 'stoppable';
import { Server } from 'http';
import axios from 'axios';
import supertest from 'supertest';
import { connect, disconnect } from 'mongoose';
import app from '../../src/server/app';
import config from '../../src/common/config';

let server: Server & stoppable.WithStop;
const port = 12345;

export const request = supertest(`http://localhost:${port}`);

axios.defaults.baseURL = `http://localhost:${port}`;

beforeAll(async () => {
  await connect(config.MONGO_URL);
  server = stoppable(app.listen(port), 0);
});

afterAll(async () => {
  server?.stop();
  await disconnect();
});
