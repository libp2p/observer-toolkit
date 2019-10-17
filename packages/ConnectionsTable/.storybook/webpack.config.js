module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.mock$/,
    use: 'arraybuffer-loader',
  })

  config.module.rules.push({
    test: /\.(png|woff|woff2|eot|ttf)$/,
    loader: 'file-loader',
  })

  config.devtool = 'source-map'

  return config
}
