import { version, name } from '../../package.json';

function env(key: string, fallback: string): string;

function env(key: string, fallback: number): number;

function env(key: string, fallback: string | number): string | number {
  const value = process.env[key] ?? fallback;
  if (typeof fallback === 'string') {
    return value;
  }
  return Number.parseFloat(env(key, fallback.toString()));
}

const config = {
  APP_NAME: env('APP_NAME', name),
  APP_VERSION: version,
  APP_HASH: process.env.githash ?? 'githash',
  HELLO_WORLD: env('HELLO_WORLD', 'hello world'),
  PORT: env('PORT', 3001),
  MONGO_URL: env('MONGO_URL', `mongodb://test:testpw@localhost:27017/${name}?authSource=admin`),
};

export default config;
