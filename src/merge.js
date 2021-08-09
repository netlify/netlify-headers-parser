const { inspect } = require('util')

// Merge headers from `_headers` with the ones from `netlify.toml`.
// When:
//  - Both `netlify.toml` headers and `_headers` are specified, paths are
//    merged. If the same path is specified in both, their headers are merged.
//    If the same path and header is specified both in `netlify.toml` and
//    `_headers`, the one in `netlify.toml` is used (i.e. overrides, does not
//    concatenate).
//  - The same path is specified twice in `netlify.toml` headers, their headers
//    are merged. If the same header is specified twice in different places for
//    the same path, the later one overrides (does not concatenate) any earlier
//    ones. If the same header is specified twice in the same place for the same
//    path, it is concatenated as a comma-separated list string.
//  - The same path is specified twice in `_headers`, the behavior is the same
//    as `netlify.toml` headers.
const mergeHeaders = function ({ fileHeaders = [], configHeaders = [] }) {
  validateArray(fileHeaders)
  validateArray(configHeaders)
  return [...fileHeaders, ...configHeaders]
}

const validateArray = function (headers) {
  if (!Array.isArray(headers)) {
    throw new TypeError(`Headers should be an array: ${inspect(headers, { colors: false })}`)
  }
}

module.exports = { mergeHeaders }
