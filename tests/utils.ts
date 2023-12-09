import type { Plugin } from "esbuild";

export function STDINPlugin(str: string): Plugin {
  return {
    name: "esbuild-stdin",
    setup(build) {
      build.onResolve({ filter: /^<stdin>$/ }, () => {
        return {
          path: "test.ts",
          namespace: "stdin",
        };
      });

      build.onLoad({ filter: /.*/, namespace: "stdin" }, async () => {
        return {
          contents: str,
          loader: "ts",
          resolveDir: "./tests/fixtures",
        };
      });
    },
  };
}

export function removeComments(str: string): string {
  return str.split("\n").filter((line) => !line.startsWith("// ")).join("\n");
}
