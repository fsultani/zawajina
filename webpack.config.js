const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    stats: 'minimal',
    port: 3000
  },
  watch: true,
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js']
  }
};
