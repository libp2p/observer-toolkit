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
    options: {
      rootMode: 'upward',
    },
  })

  config.devtool = 'source-map'

  return config
}
