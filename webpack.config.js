const path = require('path')

let webpackModule = {
  loaders: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }
  ]
}

module.exports = [
  {
    name: 'demo',
    entry: path.join(__dirname, 'demo/index.js'),
    output: {
      filename: 'demo.js',
      path: path.join(__dirname, 'demo'),
      publicPath: '/demo/'
    },
    module: webpackModule
  }
]
