import type { Plugin } from 'esbuild';
import fs from 'fs';
import yaml, { type LoadOptions } from 'js-yaml';
import path from 'path';

export interface YAMLPluginOptions {
  parserOptions?: LoadOptions;
  output?: 'json' | 'text';
}

const YAMLPlugin = ({ output, parserOptions }: YAMLPluginOptions = { output: 'json' }): Plugin => ({
  name: 'yaml',
  setup(build) {
    build.onResolve({ filter: /\.(yml|yaml)$/ }, (args) => {
      if (args.resolveDir === '') return;

      return {
        path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
        namespace: 'yaml'
      };
    });

    build.onLoad({ filter: /.*/, namespace: 'yaml' }, async (args) => {
      const yamlContent = await fs.promises.readFile(args.path, 'utf8');

      if (output === 'json') {
        const parsed = yaml.load(yamlContent, parserOptions);
        return {
          loader: 'json',
          contents: JSON.stringify(parsed)
        };
      }

      return {
        contents: yamlContent,
        loader: 'text'
      };
    });
  }
});

export default YAMLPlugin;
