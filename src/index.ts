import type { Plugin } from "esbuild";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { type DocumentOptions, parse, parseAllDocuments, type ParseOptions, type SchemaOptions, type ToJSOptions } from "yaml";

export interface YAMLPluginOptions {
  /**
   * Options to pass to the YAML parser.
   * @see https://eemeli.org/yaml/#options
   */
  parserOptions?: ParseOptions & DocumentOptions & SchemaOptions & ToJSOptions;

  /**
   * The type of YAML file to parse.
   * @default "single"
   */
  type?: "single" | "multi";
}

export function YAMLPlugin(options: YAMLPluginOptions = {}): Plugin {
  const type = options.type || "single";
  const parserOptions = options.parserOptions || {};

  const parseFn = type === "single" ? parse : parseAllDocuments;
  return {
    name: "yaml",
    setup(build) {
      build.onResolve({ filter: /\.ya?ml$/ }, (args) => {
        if (args.resolveDir === "") return;

        return {
          path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
          namespace: "yaml",
        };
      });

      build.onLoad({ filter: /\.ya?ml$/, namespace: "yaml" }, async (args) => {
        const yamlContent = await readFile(args.path, "utf8");

        const parsed = parseFn(yamlContent, parserOptions);
        return {
          loader: "json",
          contents: JSON.stringify(parsed),
        };
      });

      build.onResolve({ filter: /\.ya?ml\?raw$/ }, (args) => {
        if (args.resolveDir === "") return;

        if (args.path.endsWith("?raw")) {
          args.path = args.path.slice(0, -4);
        }
        return {
          path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
          namespace: "yaml-raw",
        };
      });

      build.onLoad({ filter: /\.ya?ml$/, namespace: "yaml-raw" }, async (args) => {
        const yamlContent = await readFile(args.path, "utf8");

        return {
          loader: "text",
          contents: yamlContent,
        };
      });
    },
  };
}

export default YAMLPlugin;
