const { parseFileHeaders } = require('./line_parser')
const { mergeHeaders } = require('./merge')
const { parseConfigHeaders } = require('./netlify_config_parser')
const { normalizeHeaders } = require('./normalize')

// Parse all headers from `netlify.toml` and `_headers` file, then normalize
// and validate those.
const parseAllHeaders = async function ({ headersFiles = [], netlifyConfigPath } = {}) {
  const [fileHeaders, configHeaders] = await Promise.all([
    getFileHeaders(headersFiles),
    getConfigHeaders(netlifyConfigPath),
  ])
  const normalizedFileHeaders = normalizeHeaders(fileHeaders)
  const normalizedConfigHeaders = normalizeHeaders(configHeaders)
  return mergeHeaders({ fileHeaders: normalizedFileHeaders, configHeaders: normalizedConfigHeaders })
}

const getFileHeaders = async function (headersFiles) {
  const fileHeaders = await Promise.all(headersFiles.map(parseFileHeaders))
  // eslint-disable-next-line unicorn/prefer-spread
  return [].concat(...fileHeaders)
}

const getConfigHeaders = async function (netlifyConfigPath) {
  if (netlifyConfigPath === undefined) {
    return []
  }

  return await parseConfigHeaders(netlifyConfigPath)
}

module.exports = { parseAllHeaders }
