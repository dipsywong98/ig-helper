import { database, up } from 'migrate-mongo';
import logger from '../../logger';
import './config';

async function migrateUp() {
  logger.info('connecting to MongoDB...');
  const { db, client } = await database.connect();
  logger.info('migrating up');
  await up(db, client);
  logger.info('migrated up, closing connection');
  await client.close();
  logger.info('migration done');
}

export default migrateUp;
