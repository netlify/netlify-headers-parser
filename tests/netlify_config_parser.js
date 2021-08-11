const test = require('ava')
const { each } = require('test-each')

const { parseConfigHeaders, normalizeHeaders } = require('..')

const FIXTURES_DIR = `${__dirname}/fixtures`

const parseHeaders = async function (fixtureName) {
  const headers = await parseConfigHeaders(`${FIXTURES_DIR}/netlify_config/${fixtureName}.toml`)
  return normalizeHeaders(headers)
}

each(
  [
    {
      title: 'empty',
      output: [],
    },
    {
      title: 'non_existing',
      output: [],
    },
    {
      title: 'success',
      output: [{ for: '/path', values: { test: 'one' } }],
    },
    {
      title: 'trim_path',
      output: [{ for: '/path', values: { test: 'one' } }],
    },
    {
      title: 'trim_name',
      output: [{ for: '/path', values: { test: 'one' } }],
    },
    {
      title: 'trim_value',
      output: [{ for: '/path', values: { test: 'one' } }],
    },
    {
      title: 'multiple_values',
      output: [{ for: '/path', values: { test: 'one,two' } }],
    },
    {
      title: 'values_undefined',
      output: [],
    },
  ],
  ({ title }, { fixtureName = title, output }) => {
    test(`Parses netlify.toml headers | ${title}`, async (t) => {
      t.deepEqual(await parseHeaders(fixtureName), output)
    })
  },
)

each(
  [
    { title: 'invalid_toml', errorMessage: /parse configuration file/ },
    { title: 'invalid_array', errorMessage: /must be an array/ },
    { title: 'invalid_object', errorMessage: /must be an object/ },
    { title: 'invalid_for_undefined', errorMessage: /Missing "for"/ },
    { title: 'invalid_for_string', errorMessage: /must be a string/ },
    { title: 'invalid_for_path', errorMessage: /must start with "\/"/ },
    { title: 'invalid_values_object', errorMessage: /must be an object/ },
    { title: 'invalid_value_name', errorMessage: /Empty header name/ },
    { title: 'invalid_value_string', errorMessage: /must be a string/ },
  ],
  ({ title }, { fixtureName = title, errorMessage }) => {
    test(`Validate syntax errors | ${title}`, async (t) => {
      await t.throwsAsync(parseHeaders(fixtureName), errorMessage)
    })
  },
)
