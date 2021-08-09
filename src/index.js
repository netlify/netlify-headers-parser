const { parseAllHeaders } = require('./all')
const { parseFileHeaders } = require('./line_parser')
const { mergeHeaders } = require('./merge')
const { parseConfigHeaders } = require('./netlify_config_parser')
const { normalizeHeaders } = require('./normalize')

module.exports = {
  parseAllHeaders,
  parseFileHeaders,
  mergeHeaders,
  parseConfigHeaders,
  normalizeHeaders,
}
