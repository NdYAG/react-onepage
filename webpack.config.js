const path = require('path')

const webpackModule = {
  rules: [
    {
      test: /\.js$/,
      use: 'babel-loader',
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
    module: webpackModule,
    devServer: {
      host: '0.0.0.0',
      disableHostCheck: true
    }
  }
]
