const { resolve } = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { paths } = require('./jsconfig.json').compilerOptions

const alias = Object.keys(paths).reduce((alias, key) => {
  alias[key] = resolve(__dirname, paths[key][0])
  return alias
}, {})

module.exports = function (env, argv) {
  return {
    entry: './src/index.js',

    output: {
      path: resolve('./build'),
      filename: 'bundle.js'
    },

    resolve: {
      alias
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
