const test = require('ava')
const { each } = require('test-each')

const { parseConfigHeaders } = require('../src/netlify_config_parser')
const { normalizeHeaders } = require('../src/normalize')

const FIXTURES_DIR = `${__dirname}/fixtures`

const parseHeaders = async function (fixtureName) {
  const { headers, errors: parseErrors } = await parseConfigHeaders(
    `${FIXTURES_DIR}/netlify_config/${fixtureName}.toml`,
  )
  const { headers: normalizedHeaders, errors: normalizeErrors } = normalizeHeaders(headers)
  return { headers: normalizedHeaders, errors: [...parseErrors, ...normalizeErrors] }
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
      title: 'trim_value_array',
      output: [{ for: '/path', values: { test: 'one,two' } }],
    },
    {
      title: 'multiple_values',
      output: [{ for: '/path', values: { test: 'one,two' } }],
    },
    {
      title: 'values_undefined',
      output: [],
    },
    {
      title: 'value_array',
      output: [{ for: '/path', values: { test: 'one,two' } }],
    },
    {
      title: 'for_path_no_slash',
      output: [{ for: 'path', values: { test: 'one' } }],
    },
  ],
  ({ title }, { fixtureName = title, output }) => {
    test(`Parses netlify.toml headers | ${title}`, async (t) => {
      const { headers, errors } = await parseHeaders(fixtureName)
      t.is(errors.length, 0)
      t.deepEqual(headers, output)
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
    { title: 'invalid_values_object', errorMessage: /must be an object/ },
    { title: 'invalid_value_name', errorMessage: /Empty header name/ },
    { title: 'invalid_value_string', errorMessage: /must be a string/ },
    { title: 'invalid_value_array', errorMessage: /must be a string/ },
  ],
  ({ title }, { fixtureName = title, errorMessage }) => {
    test(`Validate syntax errors | ${title}`, async (t) => {
      const { headers, errors } = await parseHeaders(fixtureName)
      t.is(headers.length, 0)
      // eslint-disable-next-line max-nested-callbacks
      t.true(errors.some((error) => errorMessage.test(error.message)))
    })
  },
)
