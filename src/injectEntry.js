const { isArray, isString, isObject } = require('./utils')

const stringWaring =
  "[vue-cli-plugin-eruda] does not support webpack config's entry is <string>"

const mergeEntry = (entry) => {
  const erudaPath = require.resolve('./eruda.js')

  if (isString(entry)) {
    console.warn(stringWaring)
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
        console.warn(stringWaring)
      } 
    }
  }
}
module.exports = mergeEntry
