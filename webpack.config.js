const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin  = require('extract-text-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')

const prod = process.env.NODE_ENV === 'production' ? true : false;
const plugins = [
  new ExtractTextPlugin({ filename: '[name]-[chunkhash].css', disable: false, allChunks: true }),
  new AssetsPlugin({filename: 'assets.json', path: path.join(__dirname, 'public', 'build')})
];

// enable minification if production
if ( prod ) {
  plugins.push( new webpack.optimize.UglifyJsPlugin({ sourceMap: true, minimize: true }) );
}

module.exports = {

  // entry points
  entry: {
    application: './public/scripts/application.js',
    manage: './public/scripts/manage.js',
    auth: './public/scripts/auth.js',
  },

  // output setup
  output: {
    publicPath: '/build/',
    filename: '[name]-[chunkhash].js',
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
        loader: ExtractTextPlugin.extract({
          use:[ 'css-loader', 'less-loader'],
          fallback: 'style-loader'
        })
      },

      // process js
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|components)/,
        loader: 'babel-loader'
      },

      // process fonts & images
      {
        test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
        loader: 'url-loader?limit=10000'
      },

      // process fonts
      {
        test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
        loader: 'file-loader'
      }

    ]
  },

  // plugins
  plugins: plugins
}
