const test = require('ava')
const { each } = require('test-each')

const { parseFileHeaders } = require('../src/line_parser')
const { normalizeHeaders } = require('../src/normalize')

const FIXTURES_DIR = `${__dirname}/fixtures`

const parseHeaders = async function (fixtureName) {
  const { headers, errors: parseErrors } = await parseFileHeaders(`${FIXTURES_DIR}/headers_file/${fixtureName}`)
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
      title: 'trim_line_path',
      output: [],
    },
    {
      title: 'trim_line_values',
      output: [{ for: '/path', values: { test: 'one' } }],
    },
    {
      title: 'empty_line',
      output: [{ for: '/path', values: { test: 'one' } }],
    },
    {
      title: 'comment',
      output: [{ for: '/path', values: { test: 'one' } }],
    },
    {
      title: 'success',
      output: [{ for: '/path', values: { test: 'one' } }],
    },
    {
      title: 'no_colon',
      output: [],
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
  ],
  ({ title }, { fixtureName = title, output }) => {
    test(`Parses _headers | ${title}`, async (t) => {
      const { headers, errors } = await parseHeaders(fixtureName)
      t.is(errors.length, 0)
      t.deepEqual(headers, output)
    })
  },
)

each(
  [
    { title: 'invalid_value_name', errorMessage: /Missing header name/ },
    { title: 'invalid_value_string', errorMessage: /Missing header value/ },
    { title: 'invalid_for_order', errorMessage: /Path should come before/ },
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
