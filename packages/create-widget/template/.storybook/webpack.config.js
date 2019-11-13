module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.mock$/,
    use: 'arraybuffer-loader',
  })

  config.module.rules.push({
    test: /\.base64$/,
    use: 'raw-loader',
  })

  config.module.rules.push({
    test: /\.(png|woff|woff2|eot|ttf)$/,
    loader: 'file-loader',
  })

  config.module.rules.push({
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
  })

  config.module.rules.push({
    test: /@libp2p-observer\b.+\.js$/,
    loader: 'babel-loader',
  })

  config.devtool = 'source-map'

  return config
}
