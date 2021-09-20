# Changelog

### [1.0.1](https://www.github.com/netlify/netlify-headers-parser/compare/v1.0.0...v1.0.1) (2021-09-20)


### Bug Fixes

* **deps:** update dependency map-obj to v4.3.0 ([f9bcce0](https://www.github.com/netlify/netlify-headers-parser/commit/f9bcce0c876f5acaaae46849c27a80d0db469721))

## 4.0.2 (2021-08-23)


### ⚠ BREAKING CHANGES

* add `forRegExp` property
* simplify exported methods
* add lenient parsing

### Features

* add `configHeaders` argument to `parseAllHeaders()` ([dbfb8d4](https://www.github.com/netlify/netlify-headers-parser/commit/dbfb8d411b312fe55d569717246b82855a374900))
* add `forRegExp` property ([51fdb9b](https://www.github.com/netlify/netlify-headers-parser/commit/51fdb9b53ccc3ca5a02250073390466a26c0a439))
* add lenient parsing ([9036cc8](https://www.github.com/netlify/netlify-headers-parser/commit/9036cc8b101570d0b724e7194c5effe7d666f96f))
* remove duplicates ([758b25f](https://www.github.com/netlify/netlify-headers-parser/commit/758b25f4a3f9c9dfc2d576ad862252c2dfac403c))
* simplify exported methods ([d4511c7](https://www.github.com/netlify/netlify-headers-parser/commit/d4511c74501498851882583439ff91aeba209d24))
* update README.md ([72126f4](https://www.github.com/netlify/netlify-headers-parser/commit/72126f4247d39e46ce2b772148ee37920cab4214))


### Bug Fixes

* `mergeHeaders()` should keep valid headers ([f283e28](https://www.github.com/netlify/netlify-headers-parser/commit/f283e28d4f346934715a677d1e1ebe0bf4102d5c))
* allow `for` path without a leading slash in `netlify.toml` ([85a6c3c](https://www.github.com/netlify/netlify-headers-parser/commit/85a6c3c250f5a53f34ac5d3816335b3ca1d8a00a))
* allow header values to be arrays in `netlify.toml` ([1e2ff1a](https://www.github.com/netlify/netlify-headers-parser/commit/1e2ff1a047fe511173f4ae288e6d5871c6090bab))
* comma-separated lists should append a space ([a8e2db5](https://www.github.com/netlify/netlify-headers-parser/commit/a8e2db5542b0c8b884624741c16852dbbc05d988))
* handle `_headers` with wrong file type ([69fc71a](https://www.github.com/netlify/netlify-headers-parser/commit/69fc71a5bcce75db2b98d4bbd0bd46fd41212d13))
* headers with no values ([ae227fe](https://www.github.com/netlify/netlify-headers-parser/commit/ae227feddc6d23057651000a4b85e1d84a1bb917))
* release-please action ([7708b09](https://www.github.com/netlify/netlify-headers-parser/commit/7708b0919985fccaece300521f8c5359d4979690))
