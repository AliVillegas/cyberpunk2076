const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  performance: {
    maxEntrypointSize: 100024000,
    maxAssetSize: 100024000,
  },
  devServer: {
    publicPath: '/public/',
    compress: true,
    port: 9001,
    hot: true,
  },
}
