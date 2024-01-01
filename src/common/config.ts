import { version, name } from '../../package.json';

function env(key: string, fallback: string): string;

function env(key: string, fallback: number): number;

function env(key: string, fallback: boolean): boolean;

function env(key: string, fallback: string | number | boolean): string | number | boolean {
  const value = process.env[key] ?? fallback;
  if (typeof fallback === 'string') {
    return value;
  }
  if (typeof fallback === 'boolean') {
    return value;
  }
  return Number.parseFloat(env(key, fallback.toString()));
}

const config = {
  APP_NAME: env('APP_NAME', name),
  APP_VERSION: version,
  APP_HASH: process.env.githash ?? 'githash',
  HELLO_WORLD: env('HELLO_WORLD', 'hello world'),
  PORT: env('PORT', 7101),
  MONGO_URL: env('MONGO_URL', `mongodb://test:testpw@localhost:27017/${name}?authSource=admin`),
  SERVER_MODE: env('SERVER_MODE', process.platform === 'linux' && process.argv.filter((s) => s.startsWith('/snapshot')).length === 0),
  RATE_LIMIT_WINDOW_MS: env('RATE_LIMIT_WINDOW_MS', 1000),
  RATE_LIMIT_PER_WINDOW: env('RATE_LIMIT_PER_WINDOW', 5),
  CONNECT_TO_IG: env('CONNECT_TO_IG', process.env.NODE_ENV === 'production'),
};

export default config;
