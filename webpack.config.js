var webpack = require('webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    path: "./build",
    publicPath: '/build/',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { 
        test: /\.less$/, 
        loader: "style!css!less" 
      },
      { 
        test: /\.html$/, 
        loader: "html" 
      },
      { 
        test: /\.vue$/, 
        loader: "vue"
      },
      { 
        test: /\.js$/, 
        exclude: /node_modules|vue\/|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: "babel",
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
}