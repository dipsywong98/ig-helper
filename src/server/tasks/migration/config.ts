import { config as mongoConfig } from 'migrate-mongo';
import config from '../../../common/config';

const myConfig = {
  mongodb: {
    url: config.MONGO_URL,
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
};

mongoConfig.set(myConfig);
