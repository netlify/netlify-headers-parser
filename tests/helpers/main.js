const { parseAllHeaders } = require('../..')

const FIXTURES_DIR = `${__dirname}/../fixtures`

// Pass an `input` to the main method and assert its output
const validateSuccess = async function (t, { input, output }) {
  const { headers } = await parseHeaders(input)
  t.deepEqual(headers, output)
}

// Pass an `input` to the main method and assert it fails with a specific error
const validateError = async function (t, { input, errorMessage }) {
  const { errors } = await parseHeaders(input)
  t.not(errors.length, 0)
  t.true(errors.some((error) => errorMessage.test(error.message)))
}

const parseHeaders = async function ({ headersFiles, netlifyConfigPath, configHeaders }) {
  return await parseAllHeaders({
    ...(headersFiles && { headersFiles: headersFiles.map(addFileFixtureDir) }),
    ...(netlifyConfigPath && { netlifyConfigPath: addConfigFixtureDir(netlifyConfigPath) }),
    configHeaders,
  })
}

const addFileFixtureDir = function (name) {
  return `${FIXTURES_DIR}/headers_file/${name}`
}

const addConfigFixtureDir = function (name) {
  return `${FIXTURES_DIR}/netlify_config/${name}.toml`
}

module.exports = { validateSuccess, validateError }
