const isType = (type) => (val) => {
  return Object.prototype.toString.call(val) === `[object ${type}]`
}

const isString = (val) => {
  return typeof val === 'string' && isType('String')(val)
}

const isArray = (val) => {
  return Array.isArray(val)
}

const isObject = (val) => {
  return !!val && isType('Object')(val)
}

module.exports = {
  isString,
  isArray,
  isObject
}
