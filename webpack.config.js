var path = require('path');
var webpack = require('webpack');

var Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin')

var webpack_isomorphic_tools_plugin =
  // webpack-isomorphic-tools settings reside in a separate .js file
  // (because they will be used in the web server code too).
  new Webpack_isomorphic_tools_plugin(require('./webpack-isomorphic-tools-configuration'))
  // also enter development mode since it's a development webpack configuration
  // (see below for explanation)
  .development()


module.exports = {
  devtool: 'inline-source-map',

  entry: [
    'webpack-hot-middleware/client',
    './client/index.jsx'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      // JAVASCRIPT
      {
        test:     /\.jsx?$/,
        loader:   'babel',
        exclude:  /node_modules/,
        include:  __dirname,
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react']
        }
      },
      // CSS
      {
        test: /\.css$/,
        loader: 'fake-style!css?modules'
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.sass'],
    modulesDirectories: ['src', 'node_modules']
  }
}
