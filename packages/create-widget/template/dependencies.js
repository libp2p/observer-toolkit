// List of widget dependencies, for which versions are copied from package.jsons

const dependenciesList = []
const devDependenciesList = [
  '@babel/core',
  '@babel/preset-env',
  '@babel/preset-react',
  '@libp2p-observer/shell', // For testing this widget in Storybook
  '@storybook/react',
  'arraybuffer-loader',
  'babel',
  'babel-eslint',
  'babel-loader',
  'babel-plugin-transform-es2015-modules-commonjs',
  'eslint',
  'eslint-config-prettier',
  'eslint-plugin-prettier',
  'eslint-plugin-react',
  'eslint-plugin-react-hooks',
  'husky',
  'lint-staged',
  'peer-deps-externals-webpack-plugin',
  'prettier',
  'raw-loader',
  'react-scripts',
  'storybook',
  'webpack',
  'yarn',
]
const peerDependenciesList = [
  // These should be applied via shell package by whatever publishes the widget
  '@libp2p-observer/data',
  '@libp2p-observer/sdk',
  'react',
  'styled-components',
]

const dependencies = {
  dependenciesList,
  devDependenciesList: [...devDependenciesList, ...peerDependenciesList],
  peerDependenciesList,
}

module.exports = dependencies
