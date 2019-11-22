const path = require('path')
const PeerDepsExternals = require('peer-deps-externals-webpack-plugin')
const jsxPackages = require('../../jsx-packages')

module.exports = {
  entry: './index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname),
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
          },
        },
      },
      {
        test: /\.mock$/,
        loader: 'file-loader',
      },
    ],
  },
  externals: jsxPackages.map(name => `@libp2p-observer/${name}`),
  plugins: [new PeerDepsExternals()],
}
