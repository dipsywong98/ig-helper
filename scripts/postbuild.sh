cp ecosystem.config.js dist/ecosystem.config.js
cp build-package.json dist/package.json
yarn pkg dist/package.json
cp package.json dist/package.json
cp -r migrations dist/migrations