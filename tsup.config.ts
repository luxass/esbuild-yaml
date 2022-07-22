import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  splitting: false,
  dts: {
    banner: '/// <reference path="../yaml.d.ts" />'
  }
});
