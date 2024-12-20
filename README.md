# vite-plugin-version-stamp

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

## Install

```bash
pnpm add vite-plugin-version-stamp -D
```

## Usage

```ts
import versionStamp from 'vite-plugin-version-stamp'

export default defineConfig({
  plugins: [versionStamp()],
})
```

## API

- `globalName`: The global name of the project.
- `filename`: The output filename.
- `rewrite`: The rewrite function to transform the version stamp.
  - `options.name`: The name of the project, from package.json.
  - `options.version`: The version of the project, from package.json.
  - `options.shortHash`: The short git hash of the project.
  - `options.fullHash`: The full git hash of the project.

## License

[MIT](./LICENSE) License © 2024-PRESENT [Croatia Lu](https://github.com/croatialu)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-version-stamp?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/vite-plugin-version-stamp
[npm-downloads-src]: https://img.shields.io/npm/dm/vite-plugin-version-stamp?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/vite-plugin-version-stamp
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vite-plugin-version-stamp?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=vite-plugin-version-stamp
[license-src]: https://img.shields.io/github/license/croatialu/vite-plugin-version-stamp.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/croatialu/vite-plugin-version-stamp/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/vite-plugin-version-stamp
