const { resolve } = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: resolve('./build'),
    filename: 'bundle.js'
  },
  stats: { colors: true },
  devtool: 'source-map',
  devServer: {
    port: process.env.PORT || 8080,
    contentBase: resolve('./src'),
    historyApiFallback: true
  }
}
