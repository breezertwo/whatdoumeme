const path = require('path');

module.exports = {
  entry: './server.ts',
  context: path.resolve(__dirname, './src'),
  target: 'node',
  mode: 'production',
  output: {
    filename: 'server-bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: ['mongodb-client-encryption'],
};
