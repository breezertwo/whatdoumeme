// production config
const { merge } = require('webpack-merge');
const { resolve } = require('path');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.tsx',
  output: {
    filename: (pathData) => {
      let name = pathData.chunk.name;
      if (name === undefined) {
        // undef for vendors
        name = pathData.chunk.id;
        if (name.includes('vendors-')) {
          name = 'vendors';
        }
      }
      return `${name}.min.js`;
    },
    path: resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true,
        },
      },
    },
  },
  plugins: [],
});
