const path = require('path');
const slsw = require('serverless-webpack');
const { IgnorePlugin } = require('webpack');

module.exports = {
  entry: slsw.lib.entries,
  mode: 'production',
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /^pg-native$/,
    }),
  ]
}