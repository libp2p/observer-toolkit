// List of widget dependencies, for which versions are copied from package.jsons

const dependenciesList = []
const devDependenciesList = [
  '@babel/core',
  '@babel/preset-env',
  '@babel/preset-react',
  '@nearform/observer-samples',
  '@nearform/observer-shell',
  '@nearform/observer-testing',
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
  '@nearform/observer-data',
  '@nearform/observer-sdk',
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
