const { parseFileHeaders } = require('./line_parser')
const { mergeHeaders } = require('./merge')
const { parseConfigHeaders } = require('./netlify_config_parser')
const { normalizeHeaders } = require('./normalize')
const { splitResults, concatResults } = require('./results')

// Parse all headers from `netlify.toml` and `_headers` file, then normalize
// and validate those.
const parseAllHeaders = async function ({ headersFiles = [], netlifyConfigPath } = {}) {
  const [{ headers: fileHeaders, errors: fileParseErrors }, { headers: configHeaders, errors: configParseErrors }] =
    await Promise.all([getFileHeaders(headersFiles), getConfigHeaders(netlifyConfigPath)])
  const { headers: normalizedFileHeaders, errors: fileNormalizeErrors } = normalizeHeaders(fileHeaders)
  const { headers: normalizedConfigHeaders, errors: configNormalizeErrors } = normalizeHeaders(configHeaders)
  const { headers, errors: mergeErrors } = mergeHeaders({
    fileHeaders: normalizedFileHeaders,
    configHeaders: normalizedConfigHeaders,
  })
  const errors = [
    ...fileParseErrors,
    ...fileNormalizeErrors,
    ...configParseErrors,
    ...configNormalizeErrors,
    ...mergeErrors,
  ]
  return { headers, errors }
}

const getFileHeaders = async function (headersFiles) {
  const resultsArrays = await Promise.all(headersFiles.map(parseFileHeaders))
  return concatResults(resultsArrays)
}

const getConfigHeaders = async function (netlifyConfigPath) {
  if (netlifyConfigPath === undefined) {
    return splitResults([])
  }

  return await parseConfigHeaders(netlifyConfigPath)
}

module.exports = { parseAllHeaders }
