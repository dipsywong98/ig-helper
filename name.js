const args = process.argv

const name = args[2]

const readline = require('readline');
const fs = require('fs');
const path = require('path');

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))
}

const fileReplaceName = (filename) => {
  const data = fs.readFileSync(path.join(__dirname, filename), 'utf8')
  var result = data.replace('esbuild-starter', name);
  fs.writeFileSync(path.join(__dirname, filename), result, 'utf8')
}

const main = async () => {
  await askQuestion(`Are you sure you want to name the project as '${name}'? (Ctrl+C to cancel, Enter to accept)`);
  console.log('start')
  fileReplaceName('/readme.md')
  fileReplaceName('/ecosystem.config.js')
  fileReplaceName('/migrate-mongo-config.js')
  fileReplaceName('/package.json')
}

main().catch(console.error)
