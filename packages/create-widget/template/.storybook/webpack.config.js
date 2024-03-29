module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.mock$/,
    loader: 'file-loader',
  })

  config.module.rules.push({
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
  })

  config.module.rules.push({
    test: /@libp2p\b.+\.js$/,
    loader: 'babel-loader',
  })

  config.devtool = 'source-map'

  return config
}
