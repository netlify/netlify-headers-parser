const test = require('ava')
const { each } = require('test-each')

const { validateSuccess } = require('./helpers/main')

each(
  [
    {
      title: 'empty',
      input: {},
      output: [],
    },
    {
      title: 'file_only',
      input: {
        headersFiles: ['success'],
        configHeaders: [],
      },
      output: [
        {
          for: '/path',
          values: { test: 'one' },
        },
      ],
    },
    {
      title: 'config_only',
      input: {
        configHeaders: [
          {
            for: '/pathTwo',
            values: { testTwo: 'two' },
          },
        ],
      },
      output: [
        {
          for: '/pathTwo',
          values: { testTwo: 'two' },
        },
      ],
    },
    {
      title: 'both',
      input: {
        headersFiles: ['success'],
        configHeaders: [
          {
            for: '/pathTwo',
            values: { testTwo: 'two' },
          },
        ],
      },
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
      title: 'both_same_path',
      input: {
        headersFiles: ['success'],
        configHeaders: [
          {
            for: '/path',
            values: { testTwo: 'two' },
          },
        ],
      },
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
      title: 'both_same_path_value',
      input: {
        headersFiles: ['success'],
        configHeaders: [
          {
            for: '/path',
            values: { test: 'two' },
          },
        ],
      },
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
  ({ title }, { output, input }) => {
    test(`Merges _headers with netlify.toml headers | ${title}`, async (t) => {
      await validateSuccess(t, { input, output })
    })
  },
)
