const fs = require('fs')
const { promisify } = require('util')

const pathExists = require('path-exists')

const readFileAsync = promisify(fs.readFile)

// Parse `_headers` file to an array of objects following the same syntax as
// the `headers` property in `netlify.toml`
const parseFileHeaders = async function (headersFile) {
  if (!(await pathExists(headersFile))) {
    return []
  }

  const text = await readFileAsync(headersFile, 'utf-8')
  return text.split('\n').map(normalizeLine).filter(hasHeader).map(parseLine).filter(Boolean).reduce(reduceLine, [])
}

const normalizeLine = function (line, index) {
  return { line: line.trim(), index }
}

const hasHeader = function ({ line }) {
  return line !== '' && !line.startsWith('#')
}

const parseLine = function ({ line, index }) {
  try {
    return parseHeaderLine(line)
  } catch (error) {
    throw new Error(`Could not parse header line ${index + 1}:
  ${line}
${error.message}`)
  }
}

// Parse a single header line
const parseHeaderLine = function (line) {
  if (isPathLine(line)) {
    return { path: line }
  }

  if (!line.includes(HEADER_SEPARATOR)) {
    return
  }

  const [rawName, ...rawValue] = line.split(HEADER_SEPARATOR)
  const name = rawName.trim()

  if (name === '') {
    throw new Error(`Missing header name`)
  }

  const value = rawValue.join(HEADER_SEPARATOR).trim()
  if (value === '') {
    throw new Error(`Missing header value`)
  }

  return { name, value }
}

const isPathLine = function (line) {
  return line.startsWith('/')
}

const HEADER_SEPARATOR = ':'

const reduceLine = function (headers, { path, name, value }) {
  if (path !== undefined) {
    return [...headers, { for: path, values: {} }]
  }

  if (headers.length === 0) {
    throw new Error(`Path should come before headers`)
  }

  const previousHeaders = headers.slice(0, -1)
  const currentHeader = headers[headers.length - 1]
  const { values } = currentHeader
  const newValue = values[name] === undefined ? value : `${values[name]},${value}`
  return [...previousHeaders, { ...currentHeader, values: { ...values, [name]: newValue } }]
}

module.exports = { parseFileHeaders }
