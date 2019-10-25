// crago.config.js
// see: https://github.com/sharegate/craco

const path = require('path')
const fs = require('fs')
const cracoBabelLoader = require('craco-babel-loader')
const cracoRawLoaderPlugin = require('@baristalabs/craco-raw-loader')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: [resolveApp('../sdk'), resolveApp('../connections-table')],
      },
    },
    {
      plugin: cracoRawLoaderPlugin,
      options: {
        test: /\.md$/,
      },
    },
  ],
}
