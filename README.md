<h1 align="center">YAML Plugin</h1>

This plugin allows you to import YAML files with ESBUILD
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

## 📚 Configuration

> output defaults to `json`

```js
const YAMLPlugin = require('@zotera/esbuild-yaml');

// Output as text
YAMLPlugin({
  output: 'text',
  parserOptions: {
    // Options from js-yaml
  }
});

// Output as JSON
YAMLPlugin({
  output: 'json',
  parserOptions: {
    // Options from js-yaml
  }
});
```
