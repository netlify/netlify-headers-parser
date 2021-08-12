const test = require('ava')
const { each } = require('test-each')

const { mergeHeaders } = require('..')

each(
  [
    { output: [] },
    { fileHeaders: [], configHeaders: [], output: [] },
    {
      fileHeaders: [
        {
          for: '/path',
          values: { test: 'one' },
        },
      ],
      configHeaders: [],
      output: [
        {
          for: '/path',
          values: { test: 'one' },
        },
      ],
    },
    {
      fileHeaders: [],
      configHeaders: [
        {
          for: '/pathTwo',
          values: { testTwo: 'two' },
        },
      ],
      output: [
        {
          for: '/pathTwo',
          values: { testTwo: 'two' },
        },
      ],
    },
    {
      fileHeaders: [
        {
          for: '/path',
          values: { test: 'one' },
        },
      ],
      configHeaders: [
        {
          for: '/pathTwo',
          values: { testTwo: 'two' },
        },
      ],
      output: [
        {
          for: '/path',
          values: { test: 'one' },
        },
        {
          for: '/pathTwo',
          values: { testTwo: 'two' },
        },
      ],
    },
    {
      fileHeaders: [
        {
          for: '/path',
          values: { test: 'one' },
        },
      ],
      configHeaders: [
        {
          for: '/path',
          values: { testTwo: 'two' },
        },
      ],
      output: [
        {
          for: '/path',
          values: { test: 'one' },
        },
        {
          for: '/path',
          values: { testTwo: 'two' },
        },
      ],
    },
    {
      fileHeaders: [
        {
          for: '/path',
          values: { test: 'one' },
        },
      ],
      configHeaders: [
        {
          for: '/path',
          values: { test: 'two' },
        },
      ],
      output: [
        {
          for: '/path',
          values: { test: 'one' },
        },
        {
          for: '/path',
          values: { test: 'two' },
        },
      ],
    },
  ],
  ({ title }, { fileHeaders, configHeaders, output }) => {
    test(`Merges _headers with netlify.toml headers | ${title}`, async (t) => {
      const { headers, errors } = await mergeHeaders({ fileHeaders, configHeaders })
      t.is(errors.length, 0)
      t.deepEqual(headers, output)
    })
  },
)

each(
  [
    { fileHeaders: { for: true }, errorMessage: /should be an array/ },
    { configHeaders: { for: true }, errorMessage: /should be an array/ },
  ],
  ({ title }, { fileHeaders, configHeaders, errorMessage }) => {
    test(`Validate syntax errors | ${title}`, async (t) => {
      const { headers, errors } = await mergeHeaders({ fileHeaders, configHeaders })
      t.is(headers.length, 0)
      // eslint-disable-next-line max-nested-callbacks
      t.true(errors.some((error) => errorMessage.test(error.message)))
    })
  },
)
