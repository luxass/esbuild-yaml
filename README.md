<h1 align="center">YAML Plugin</h1>

This plugin allows you to import YAML files with ESBUILD

> NOTE:
> This plugin does not parse the yaml when imported.
> <br/>
> If you want the YAML to get parsed, you can check this plugin out [YAML Plugin](https://github.com/martonlederer/esbuild-plugin-yaml)

<br/>
<br/>

## 📦 Installation

```sh
npm install --save-dev @zotera/esbuild-yaml
```

## 📚 Usage

Add this to your build file

```js
const esbuild = require('esbuild');
const YAMLPlugin = require('@zotera/esbuild-yaml');

const yourConfig = {};

esbuild.build({
  ...yourConfig,
  plugins: [YAMLPlugin()]
});
```
