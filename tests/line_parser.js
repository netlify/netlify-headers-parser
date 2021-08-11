const test = require('ava')
const { each } = require('test-each')

const { parseFileHeaders, normalizeHeaders } = require('..')

const FIXTURES_DIR = `${__dirname}/fixtures`

const parseHeaders = async function (fixtureName) {
  const headers = await parseFileHeaders(`${FIXTURES_DIR}/headers_file/${fixtureName}`)
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
      t.deepEqual(await parseHeaders(fixtureName), output)
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
      await t.throwsAsync(parseHeaders(fixtureName), errorMessage)
    })
  },
)
