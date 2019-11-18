// Build array of loaded binary files

const path = require('path')

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
        test: /\.mock$/,
        include: path.resolve(__dirname),
        exclude: /node_modules/,
        use: 'arraybuffer-loader',
      },
      {
        test: /\.base64$/,
        loader: 'raw-loader',
      },
    ],
  },
}
