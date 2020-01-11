const path = require('path')
const VueCliErudaPlugin = require('./src/webpackPlugin')

module.exports = {
  mode: 'development',
  entry: {
    // vue-cli will convert <string> entry to <array>
    main: [
      './demo/index.js' 
    ]
  },
  output: {
    filename: 'bundle.js',
    chunkFilename: 'bundle.js',
    path: path.resolve(process.cwd(), 'dist')
  },
  plugins: [
    new VueCliErudaPlugin()
  ]
}