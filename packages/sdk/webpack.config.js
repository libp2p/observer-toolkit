const path = require('path')
const nodeExternals = require('webpack-node-externals')
const repoRootModulesPath = path.resolve(__dirname, '../../node_modules')

module.exports = {
  entry: './index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
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
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|otf|svg)$/,
        loader: 'file-loader',
      },
    ],
  },
  externals: [
    nodeExternals(),
    nodeExternals({
      modulesDir: repoRootModulesPath,
    }),
  ],
}
