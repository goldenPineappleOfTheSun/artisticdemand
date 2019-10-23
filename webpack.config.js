const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  entry: {
    polyfill: './src/babel-promise.js',
    main: './src/index.js',
    admin: './src/admin.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ["@babel/transform-runtime"]
          }
        }
      },
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
    ]
  },
  plugins: [
      new VueLoaderPlugin(),
      //"@babel/transform-runtime"
  ],/*"presets": ["@babel/preset-env"],
    "plugins": [
        ["@babel/transform-runtime"]
    ]
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
    'vue$': 'vue/dist/vue.esm.js',
    }
  }*/
}