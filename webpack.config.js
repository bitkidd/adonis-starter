
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const AssetsPlugin = require('assets-webpack-plugin')

module.exports = (env, argv) => {

  const plugins = [
    new MiniCssExtractPlugin({
      filename: (argv.mode === 'production' ? '[name]-[hash].css' : '[name].css'),
      disable: false,
      allChunks: true
    }),
    new AssetsPlugin({
      filename: 'assets.json',
      path: path.join(__dirname, 'public', 'build')
    })
  ]

  return {

    // mode
    mode: env || 'development',

    // entry points
    entry: {
      application: './public/scripts/application.js',
      // manage: './public/scripts/manage.js',
      // auth: './public/scripts/auth.js',
    },

    // output setup
    output: {
      publicPath: '/build/',
      filename: (argv.mode === 'production' ? '[name]-[hash].js' : '[name].js'),
      path: path.resolve(__dirname, 'public', 'build')
    },

    // sourcemaps
    devtool: 'source-map',
    module: {
      rules: [

        // process less
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader'
          ]
        },

        // process css
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },

        // process js
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: ['babel-loader']
        },

        // process fonts & images
        {
          test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
          use: ['url-loader?limit=10000']
        },

        // process fonts
        {
          test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
          use: ['file-loader']
        }

      ]
    },

    // plugins
    plugins: plugins

  }

}
