// crago.config.js
// see: https://github.com/sharegate/craco

const path = require('path')
const fs = require('fs')
const cracoBabelLoader = require('craco-babel-loader')
const cracoRawLoaderPlugin = require('@baristalabs/craco-raw-loader')

const appDirectory = fs.realpathSync(process.cwd())
const resolvePackage = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: [
          // Without these, react app won't babelify peer packages and hits "unexpected token" error
          resolvePackage('../sdk'),
          resolvePackage('../connections-table'),
          resolvePackage('../streams-table'),
        ],
      },
    },
    {
      plugin: cracoRawLoaderPlugin,
      options: {
        test: /(\.md$|\.base64$)/,
      },
    },
  ],
}
