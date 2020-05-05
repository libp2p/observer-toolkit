// List of widget dependencies, for which versions are copied from package.jsons

const dependenciesList = []
const devDependenciesList = [
  '@babel/core',
  '@babel/preset-env',
  '@babel/preset-react',
  '@libp2p-observer/samples',
  '@libp2p-observer/shell',
  '@libp2p-observer/testing',
  '@storybook/react',
  'arraybuffer-loader',
  'babel',
  'babel-eslint',
  'babel-loader',
  'babel-plugin-styled-components',
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
  'react-scripts',
  'storybook',
  'webpack',
  'yarn',
]
const peerDependenciesList = [
  '@libp2p-observer/data',
  '@libp2p-observer/sdk',
  'react',
  'react-markdown',
  'styled-components',
]

const dependencies = {
  dependenciesList,
  devDependenciesList: [...devDependenciesList, ...peerDependenciesList],
  peerDependenciesList,
}

module.exports = dependencies
