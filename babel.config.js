const jsxPackages = require('./jsx-packages')

module.exports = function(api) {
  api.cache(true)

  const presets = ['@babel/env', '@babel/preset-react']

  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',

    // TODO: confirm what change, most likely an dep, changed this from being
    // essential to breaking the build with 'exports is undefined' errors:
    // 'transform-es2015-modules-commonjs',
  ]

  // Ignore dependencies except for our specified lerna packages containing JSX etc
  const ignoreRegex = new RegExp(
    `node_modules[\\\\/](?!@libp2p-observer[\\\\/](${jsxPackages.join(
      '|'
    )}))[\\\\/]`
  )

  const ignore = [ignoreRegex, /samples/]
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
