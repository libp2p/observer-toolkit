// crago.config.js
// see: https://github.com/sharegate/craco

const path = require('path')
const fs = require('fs')
const cracoBabelLoader = require('craco-babel-loader')
const cracoRawLoaderPlugin = require('@baristalabs/craco-raw-loader')

const jsxPackages = require('../../jsx-packages')

const appDirectory = fs.realpathSync(process.cwd())
const resolvePackage = relativePath => path.resolve(appDirectory, relativePath)

const includes = jsxPackages.map(packageDir =>
  resolvePackage(`../${packageDir}`)
)

module.exports = {
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes,
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
