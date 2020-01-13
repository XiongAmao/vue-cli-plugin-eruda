const path = require('path')
const VueCliErudaPlugin = require('./src/webpackPlugin')

module.exports = {
  mode: 'development',
  // entry: {
  //   // vue-cli will convert <string> entry to <array>
  //   main: ['./demo/index.js'],
  //   erudaaaa: ['./demo/eruda.js']
  // },
  // entry: ['./demo/index.js', './demo/eruda.js'],
  entry: () => {
    return Promise.resolve({
      wtf: ['./demo/index.js'],
      aaa: './demo/index.js'
    })
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(process.cwd(), 'dist')
  },
  plugins: [
    new VueCliErudaPlugin({
      enable: true,
      plugins: ['fps', 'eruda-timi']
    })
  ]
}
