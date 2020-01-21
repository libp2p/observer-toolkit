const getWebpackConfig = require('../../getWebpackConfig')

// All test runners, including Jest with testing-library DOM renderers, run in Node.js
const config = getWebpackConfig(__dirname)
config.target = 'node'

module.exports = config
