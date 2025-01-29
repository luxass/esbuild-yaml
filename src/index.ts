import type { Plugin } from "esbuild";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  type DocumentOptions,
  parse,
  parseAllDocuments,
  type ParseOptions,
  type SchemaOptions,
  type ToJSOptions,
} from "yaml";

type YAMLValue =
  | number
  | string
  | boolean
  | null
  | { [key: string]: YAMLValue }
  | YAMLValue[];

export interface YAMLPluginOptions {
  /**
   * Options to pass to the YAML parser.
   * @see https://eemeli.org/yaml/#options
   *
   * NOTE:
   * Options inside `ToJSOptions` only works if `type` is set to "single".
   */
  parserOptions?: ParseOptions & DocumentOptions & SchemaOptions & ToJSOptions;

  /**
   * The type of YAML file to parse.
   * @default "single"
   */
  type?: "single" | "multi";

  /**
   * A function to transform the parsed YAML data.
   * @param {YAMLValue} data The parsed YAML data.
   * @param {string} filePath The path to the YAML file.
   * @returns {YAMLValue | undefined} The transformed data.
   */
  transform?: (data: YAMLValue, filePath: string) => YAMLValue | undefined;
}

export function YAMLPlugin(options: YAMLPluginOptions = {}): Plugin {
  const type = options.type || "single";
  const parserOptions = options.parserOptions || {};

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

        let parsed = {};

        if (type === "multi") {
          parsed = parseAllDocuments(yamlContent, parserOptions).map((doc) => doc.toJSON());
        } else {
          parsed = parse(yamlContent, parserOptions);
        }

        let content = parsed;

        if (options.transform != null && typeof options.transform === "function") {
          const transformed = options.transform(content, args.path);

          if (transformed != null) {
            content = transformed;
          }
        }

        const code = `var data = ${JSON.stringify(content, null, 2)}\n\n;`;

        return {
          loader: "js",
          contents: `${code}\nexport default data;`,
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
