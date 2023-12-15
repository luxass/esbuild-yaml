# esbuild-yaml

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

This plugin allows you to import YAML files with ESBUILD
<br/>
<br/>

## 📦 Installation

```sh
npm install --save-dev esbuild-yaml
```

## 📚 Usage

Add this to your build file

```js
import { build } from "esbuild";
import { YAMLPlugin } from "esbuild-yaml";

const yourConfig = {};

build({
  ...yourConfig,
  plugins: [
    YAMLPlugin()
  ]
});
```

### TypeScript

If you are using TypeScript, you need to add the following to your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "types": [
      "esbuild-yaml/types"
    ]
  }
}
```

## 📖 Examples

```js
// build.js
import { build } from "esbuild";
import { YAMLPlugin } from "esbuild-yaml";

const yourConfig = {};

build({
  ...yourConfig,
  plugins: [
    YAMLPlugin()
  ]
});
```

```yaml
# config.yaml
name: esbuild-yaml

version: 1.0.0
```

```ts
// index.ts

import config from "./config.yaml"; // this will be converted to a JSON object
import configRaw from "./config.yaml?raw"; // this will be the raw YAML string

console.log(config); // { name: "esbuild-yaml", version: "1.0.0" }
console.log(configRaw); // name: esbuild-yaml\nversion: 1.0.0
```

## 📄 License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/esbuild-yaml?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/esbuild-yaml
[npm-downloads-src]: https://img.shields.io/npm/dm/esbuild-yaml?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/esbuild-yaml
