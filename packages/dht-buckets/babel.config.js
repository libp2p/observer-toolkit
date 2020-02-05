'use strict'

const { nonJsxPackagesRegex } = require('./jsx-packages')

module.exports = function(api) {
  const isTest = api.env('test')
  api.cache(true)

  const presets = [
    [
      '@babel/env',
      isTest
        ? {
            targets: {
              node: 'current',
            },
          }
        : {},
    ],
    '@babel/preset-react',
  ]

  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    'babel-plugin-styled-components',

    // TODO: confirm what change, most likely an dep, changed this from being
    // essential to breaking the build with 'exports is undefined' errors:
    // 'transform-es2015-modules-commonjs',
  ]

  const ignore = [nonJsxPackagesRegex]
  const babelrcRoots = ['.', 'packages/*', '.storybook']

  const sourceType = 'unambiguous'

  return {
    babelrcRoots,
    ignore,
    plugins,
    presets,
    sourceType,
  }
}
