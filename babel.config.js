module.exports = function (api) {
  api.cache(true);

  const presets = [
    "@babel/preset-env",
    "@babel/preset-react"
  ]

  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "transform-es2015-modules-commonjs"
  ]

  const ignore = [
    "node_modules"
  ]

  const babelrcRoots = [
    '.',
    'packages/*',
    '.storybook'
  ]

  return {
    presets,
    plugins,
    ignore,
    babelrcRoots,
  }
}