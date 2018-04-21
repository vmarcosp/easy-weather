const { resolve } = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function (env, argv) {
  return {
    entry: './src/index.js',

    output: {
      path: resolve('./build'),
      filename: 'bundle.js'
    },

    resolve: {
      alias: {
        '@scss': resolve(__dirname, 'src/scss')
        '@constants': resolve(__dirname, 'src/constants')
      }
    },

    module: {
      rules: [{
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [{ loader: 'css-loader' }, { loader: 'sass-loader' }]
        })
      }]
    },

    // Pretty stats
    stats: { colors: true },

    // Sourcemap config
    devtool: 'source-map',

    // dev-server config
    devServer: {
      port: process.env.PORT || 8080,
      contentBase: resolve('./src'),
      historyApiFallback: true
    },

    // Plugins
    plugins: [
      new ExtractTextPlugin('styles.css')
    ]
  }
}
