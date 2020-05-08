'use strict'

// Generates standard webpack.config.js export for JSX packages and widgets
const path = require('path')
const PeerDepsExternals = require('peer-deps-externals-webpack-plugin')
const { jsxPackages } = require('./jsx-packages')

// const jsxPackageNames = jsxPackages.map(name => `@libp2p/${name}`)

function getWebpackConfig(dirname) {
  const jsxPackagePaths = jsxPackages.map(name =>
    path.resolve(dirname, '..', name)
  )

  return {
    entry: './index.js',
    mode: 'development',
    output: {
      path: path.resolve(dirname, 'build'),
      filename: 'index.js',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: jsxPackagePaths,
          exclude: /([\\/](node_modules|build)[\\/]|webpack)/,
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
          test: /\.(png|woff|woff2|eot|ttf|otf|svg|mock)$/,
          loader: 'file-loader',
        },
      ],
    },
    //    externals: jsxPackageNames,
    plugins: [new PeerDepsExternals()],
  }
}

module.exports = getWebpackConfig
