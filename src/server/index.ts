import './dotenv';
// import mongoose, { connect } from 'mongoose';
import { exec } from 'child_process';
import config from '../common/config';
import app from './app';
import logger from './logger';
// import migrateUp from './tasks/migration/up';

// mongoose.set('strictQuery', true);

const init = async () => {
  logger.info('starting application');
  // await migrateUp();
  // await connect(config.MONGO_URL);
  await new Promise<void>((resolve) => {
    resolve();
  });

  app.listen(config.PORT, () => {
    const url = `http://localhost:${config.PORT}`;
    logger.info(`Application is listening on ${url}`);
    // open('https://localhost:7101');
    console.log(process.platform, process.argv);
    if (process.platform !== 'linux' && process.argv.filter((s) => s.includes('index.js')).length > 0) {
      // eslint-disable-next-line no-nested-ternary
      const start = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open');
      exec(`${start} ${url}`);
    }
  });
};

init().catch(logger.error);
