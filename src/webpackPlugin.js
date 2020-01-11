const inject = require('./mergeEntry')
const isNotProdEnv = process.env.NODE_ENV !== 'production'

class ErudaWebpackPlugin {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        // enable by default when NODE_ENV !== 'production'
        enable: isNotProdEnv,
        plugins: []
      },
      options
    )
  }
  apply(compiler) {
    const pluginFunction = (ctx, entry) => {
      const enable = this.options.enable
      if (enable) {
        inject(entry)
      }
      return Promise.resolve()
    }

    if (compiler.hooks) {
      compiler.hooks.entryOption.tap(
        { name: 'ErudaWebpackPlugin' },
        pluginFunction
      )
    }
  }
}

module.exports = ErudaWebpackPlugin
