const path = require('path')
const PeerDepsExternals = require('peer-deps-externals-webpack-plugin')

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
        exclude: /([\\/](node_modules|build|proto)[\\/]|webpack)/,
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
          },
        },
      },
    ],
  },
  plugins: [new PeerDepsExternals()],
}
