# esbuild-plugin-yaml

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

This plugin allows you to import YAML files with ESBUILD
<br/>
<br/>

## 📦 Installation

```sh
npm install --save-dev @luxass/esbuild-yaml
```

## 📚 Usage

Add this to your build file

```js
const esbuild = require("esbuild");
const YAMLPlugin = require("@luxass/esbuild-yaml");

const yourConfig = {};

esbuild.build({
  ...yourConfig,
  plugins: [YAMLPlugin()]
});
```

## 📚 Configuration

> output defaults to `json`

```js
const YAMLPlugin = require("@luxass/esbuild-yaml");

// Output as text
YAMLPlugin({
  output: "text",
  parserOptions: {
    // Options from js-yaml
  }
});

// Output as JSON
YAMLPlugin({
  output: "json",
  parserOptions: {
    // Options from js-yaml
  }
});
```

## 📄 License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@luxass/esbuild-plugin-yaml?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/@luxass/esbuild-plugin-yaml
[npm-downloads-src]: https://img.shields.io/npm/dm/@luxass/esbuild-plugin-yaml?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/@luxass/esbuild-plugin-yaml
