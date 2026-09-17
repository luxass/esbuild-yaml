import { readFile } from "node:fs/promises";
import path from "node:path";

import type { OnLoadArgs, OnLoadResult, OnResolveArgs, OnResolveResult, Plugin } from "esbuild";
import type { DocumentOptions, ParseOptions, SchemaOptions, ToJSOptions } from "yaml";
import { parse, parseAllDocuments } from "yaml";

type YAMLValue = number | string | boolean | null | { [key: string]: YAMLValue } | YAMLValue[];

type YAMLParserOptions = ParseOptions & DocumentOptions & SchemaOptions & ToJSOptions;

export interface YAMLPluginOptions {
  /**
   * Options to pass to the YAML parser.
   * @see https://eemeli.org/yaml/#options
   *
   * NOTE:
   * Options inside `ToJSOptions` only works if `type` is set to "single".
   */
  parserOptions?: YAMLParserOptions;

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

function resolveYaml(namespace: "yaml" | "yaml-raw") {
  return (args: OnResolveArgs): OnResolveResult | null => {
    if (args.resolveDir === "") return null;

    let importPath = args.path;
    if (namespace === "yaml-raw" && importPath.endsWith("?raw")) {
      importPath = importPath.slice(0, -4);
    }

    return {
      path: path.isAbsolute(importPath) ? importPath : path.join(args.resolveDir, importPath),
      namespace,
    };
  };
}

async function loadYaml(
  args: OnLoadArgs,
  type: "single" | "multi",
  parserOptions: YAMLParserOptions,
  transform: YAMLPluginOptions["transform"],
): Promise<OnLoadResult> {
  const yamlContent = await readFile(args.path, "utf8");

  const parsed: unknown =
    type === "multi"
      ? parseAllDocuments(yamlContent, parserOptions).map((doc) => doc.toJSON() as YAMLValue)
      : (parse(yamlContent, parserOptions) as YAMLValue);

  let content = parsed as YAMLValue;

  if (typeof transform === "function") {
    const transformed = transform(content, args.path);

    if (transformed != null) {
      content = transformed;
    }
  }

  const code = `var data = ${JSON.stringify(content, null, 2)};\n\n`;

  return {
    loader: "js",
    contents: `${code}\nexport default data;`,
  };
}

async function loadYamlRaw(args: OnLoadArgs): Promise<OnLoadResult> {
  const yamlContent = await readFile(args.path, "utf8");

  return {
    loader: "text",
    contents: yamlContent,
  };
}

export function YAMLPlugin(options: YAMLPluginOptions = {}): Plugin {
  const type = options.type ?? "single";
  const parserOptions = options.parserOptions ?? {};
  const transform = options.transform;

  return {
    name: "yaml",
    setup(build) {
      // oxlint-disable-next-line eslint/require-unicode-regexp -- esbuild filters must be Go-compatible regexes
      build.onResolve({ filter: /\.ya?ml$/ }, resolveYaml("yaml"));
      // oxlint-disable-next-line eslint/require-unicode-regexp -- esbuild filters must be Go-compatible regexes
      build.onLoad({ filter: /\.ya?ml$/, namespace: "yaml" }, (args) =>
        loadYaml(args, type, parserOptions, transform),
      );
      // oxlint-disable-next-line eslint/require-unicode-regexp -- esbuild filters must be Go-compatible regexes
      build.onResolve({ filter: /\.ya?ml\?raw$/ }, resolveYaml("yaml-raw"));
      // oxlint-disable-next-line eslint/require-unicode-regexp -- esbuild filters must be Go-compatible regexes
      build.onLoad({ filter: /\.ya?ml$/, namespace: "yaml-raw" }, loadYamlRaw);
    },
  };
}

export default YAMLPlugin;
