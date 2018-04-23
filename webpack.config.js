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
        '@scss': resolve(__dirname, 'src/scss'),
        '@constants': resolve(__dirname, 'src/constants'),
        '@components': resolve(__dirname, 'src/components'),
        '@utils': resolve(__dirname, 'src/utils')
      }
    },

    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({ use: [{ loader: 'css-loader' }, { loader: 'sass-loader' }] })
        },
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'stage-2']
            }
          }
        }
      ]
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
