import './dotenv';
// import mongoose, { connect } from 'mongoose';
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
    logger.info(`Application is listening on port ${config.PORT}`);
  });
};

init().catch(logger.error);
