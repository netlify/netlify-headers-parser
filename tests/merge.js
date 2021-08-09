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
    test(`Merges _headers with netlify.toml headers | ${title}`, (t) => {
      t.deepEqual(mergeHeaders({ fileHeaders, configHeaders }), output)
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
      await t.throws(mergeHeaders.bind(undefined, { fileHeaders, configHeaders }), errorMessage)
    })
  },
)
