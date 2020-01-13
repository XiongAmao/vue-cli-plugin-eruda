const { isArray, isString, isObject, isFunction } = require('./utils')

const stringWarning =
  "[vue-cli-plugin-eruda] does not support webpack config's entry is <string>"
const functionWarning = '[vue-cli-plugin-eruda] does not support webpack config\'s entry is \<function\>'

const mergeEntry = (entry) => {
  const erudaPath = require.resolve('./eruda.js')

  if (isString(entry)) {
    console.warn(stringWarning)
    return
  }

  if (isArray(entry)) {
    entry.unshift(erudaPath)
    return
  }

  if (isObject(entry)) {
    for (const key in entry) {
      if (isArray(entry[key])) {
        entry[key].unshift(erudaPath)
      } else if (isString(entry[key])) {
        console.warn(stringWarning)
      } 
    }
  }
}
module.exports = mergeEntry
