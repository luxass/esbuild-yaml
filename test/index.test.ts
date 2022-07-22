import { build } from 'esbuild';
import { describe, expect, it } from 'vitest';

import YAMLPlugin from '../src';

describe('Yaml Plugin', () => {
  it('json output', async () => {
    const result = await build({
      entryPoints: ['test/shared/config-utils.ts'],
      format: 'esm',
      bundle: true,
      plugins: [YAMLPlugin()],
      outfile: './test/shared/config-utils.js'
    });
    expect(result).toStrictEqual({ errors: [], warnings: [] });
  });

  it('text output', async () => {
    const result = await build({
      entryPoints: ['test/shared/config-utils.ts'],
      format: 'esm',
      bundle: true,
      plugins: [
        YAMLPlugin({
          output: 'text'
        })
      ],
      outfile: './test/shared/config-utils.js'
    });
    expect(result).toStrictEqual({ errors: [], warnings: [] });
  });
});
