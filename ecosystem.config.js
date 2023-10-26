const fs = require('fs');
const path = require('path');

const env = {
  NODE_ENV: "production"
}

const pathToEnv = path.join(__dirname, '.env');
if (fs.existsSync(pathToEnv)) {
  const str = fs.readFileSync(pathToEnv, 'utf8');
  str.split('\n').forEach((line) => {
    const [key, ...value] = line.split('=');
    if (key && value && value.length) {
      env[key] = value.join('=');
    }
  });
}

module.exports = {
  apps: [{
    name: "esbuild-starter",
    script: "./index.js",
    watch: ['./index.js', '.env'],
    ignore_watch: ['logs'],
    env,
    watch: true,
    watch_delay: 1000,
  }]
}