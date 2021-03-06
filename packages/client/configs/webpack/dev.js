// development config
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'development',
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  entry: [
    'react-hot-loader/patch', // activate HMR for React
    'webpack-dev-server/client?http://localhost:3030', // bundle the client for webpack-dev-server and connect to the provided endpoint
    'webpack/hot/only-dev-server', // bundle the client for hot reloading
    './index.tsx',
  ],
  devServer: {
    hot: true, // enable HMR on the server
    disableHostCheck: true,
    historyApiFallback: true,
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
});
