const path = require('path')
const VueCliErudaPlugin = require('./src/webpackPlugin')

module.exports = {
  mode: 'development',
  entry: ['./demo/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'dist')
  },
  plugins: [
    new VueCliErudaPlugin()
  ]
}