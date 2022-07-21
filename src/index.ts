import type { Plugin } from 'esbuild';
import { promises } from 'fs';
import path from 'path';

const readFile = promises.readFile;

const YAMLPlugin = (): Plugin => ({
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
      const yamlContent = await readFile(args.path, 'utf8');

      return {
        contents: yamlContent,
        loader: 'text'
      };
    });
  }
});

export default YAMLPlugin;
