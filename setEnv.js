const package = require('./package.json')

process.env.MONGO_URL = `mongodb://localhost:27017/${package.name}-test`