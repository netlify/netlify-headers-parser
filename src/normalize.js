const isPlainObj = require('is-plain-obj')
const mapObj = require('map-obj')

// Validate and normalize an array of `headers` objects.
// This step is performed after `headers` have been parsed from either
// `netlify.toml` or `_headerss`.
const normalizeHeaders = function (headers) {
  if (!Array.isArray(headers)) {
    throw new TypeError(`Headers must be an array not: ${headers}`)
  }

  return headers.map(parseHeader).filter(Boolean)
}

const parseHeader = function (header, index) {
  if (!isPlainObj(header)) {
    throw new TypeError(`Header must be an object not: ${header}`)
  }

  try {
    return parseHeaderObject(header)
  } catch (error) {
    throw new Error(`Could not parse header number ${index + 1}:
  ${JSON.stringify(header)}
${error.message}`)
  }
}

// Parse a single `headers` object
const parseHeaderObject = function ({ for: rawPath, values: rawValues }) {
  const path = normalizePath(rawPath)

  if (rawValues === undefined) {
    return
  }

  const values = normalizeValues(rawValues)

  if (Object.keys(values).length === 0) {
    return
  }

  return { for: path, values }
}

// Normalize and validate the `for` field
const normalizePath = function (rawPath) {
  if (rawPath === undefined) {
    throw new TypeError('Missing "for" field')
  }

  if (typeof rawPath !== 'string') {
    throw new TypeError(`"for" must be a string not: ${rawPath}`)
  }

  const path = rawPath.trim()
  if (!path.startsWith('/')) {
    throw new Error(`"for" must start with "/": ${path}`)
  }
  return path
}

// Normalize and validate the `values` field
const normalizeValues = function (rawValues) {
  if (!isPlainObj(rawValues)) {
    throw new TypeError(`"values" must be an object not: ${rawValues}`)
  }

  return mapObj(rawValues, normalizeValue)
}

// Normalize and validate each header `values`
const normalizeValue = function (rawKey, rawValue) {
  const key = rawKey.trim()
  if (key === '' || key === 'undefined') {
    throw new Error('Empty header name')
  }

  if (typeof rawValue !== 'string') {
    throw new TypeError(`Header "${key}" value must be a string not: ${rawValue}`)
  }

  const value = normalizeMultipleValues(rawValue.trim())
  return [key, value]
}

// Multiple values can be specified by using whitespaces and commas.
// For example:
//   [[headers]]
//   for = "/*"
//     [headers.values]
// 	   cache-control = '''
// 	   max-age=0,
// 	   no-cache,
// 	   no-store,
// 	   must-revalidate'''
// Is normalized to:
//   [[headers]]
//   for = "/*"
//     [headers.values]
// 	   cache-control = "max-age=0,no-cache,no-store,must-revalidate"
const normalizeMultipleValues = function (value) {
  return value.split(MULTIPLE_VALUES_REGEXP).join(',')
}

const MULTIPLE_VALUES_REGEXP = /\s*,\s*/g

module.exports = { normalizeHeaders }
