import type { Plugin } from "esbuild";

export function STDINPlugin(str: string): Plugin {
  return {
    name: "esbuild-stdin",
    setup(build) {
      // oxlint-disable-next-line eslint/require-unicode-regexp -- esbuild filters must be Go-compatible regexes
      build.onResolve({ filter: /^<stdin>$/ }, () => {
        return {
          path: "test.ts",
          namespace: "stdin",
        };
      });

      // oxlint-disable-next-line eslint/require-unicode-regexp -- esbuild filters must be Go-compatible regexes
      build.onLoad({ filter: /.*/, namespace: "stdin" }, async () => {
        return {
          contents: str,
          loader: "ts",
          resolveDir: "./test/fixtures",
        };
      });
    },
  };
}

export function removeComments(str: string): string {
  return str
    .split("\n")
    .filter((line) => !line.startsWith("// "))
    .join("\n");
}
