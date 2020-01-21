// crago.config.js
// see: https://github.com/sharegate/craco

const path = require('path')
const fs = require('fs')
const cracoBabelLoader = require('craco-babel-loader')
const cracoRawLoaderPlugin = require('@baristalabs/craco-raw-loader')

const { jsxPackages, nonJsxPackagesRegex } = require('../../jsx-packages')

const appDirectory = fs.realpathSync(process.cwd())
const resolvePackage = relativePath => path.resolve(appDirectory, relativePath)

const includes = jsxPackages.map(packageDir =>
  resolvePackage(`../${packageDir}`)
)

module.exports = {
  plugins: [
    {
      plugin: {
        overrideJestConfig: ({ jestConfig, context: { rootDir } }) => {
          jestConfig.transform['^.+\\.(js|jsx|ts|tsx)$'] = [
            'babel-jest',
            { rootMode: 'upward' },
          ]
          jestConfig.transformIgnorePatterns.push(
            nonJsxPackagesRegex.toString()
          )

          // Jest ignores peer dependencies etc and gets deps from repo root: https://github.com/facebook/jest/issues/5913
          // Yarn likes to hoist dependencies of dependencies: https://github.com/yarnpkg/yarn/issues/5978
          // So to avoid "invalid hook call" errors, we must use the root repo react everywhere, hoisted by Yarn.

          // This makes Jest's current dep resolution behaviour explicit in case this bug-feature in Jest is ever fixed.
          const rootModulesPath = path.resolve(rootDir, '../../node_modules/')
          jestConfig.moduleNameMapper['/react/'] = path.resolve(
            rootModulesPath,
            'react'
          )
          jestConfig.moduleNameMapper['/react-dom/'] = path.resolve(
            rootModulesPath,
            'react-dom'
          )

          return jestConfig
        },
      },
    },
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
