const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    stats: 'errors-only',
    compress: true,
    host: 'localhost',
    port: 3000,
  },
  watch: true,
};
