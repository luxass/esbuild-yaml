import { build } from "esbuild";
import { expect, it } from "vitest";

import YAMLPlugin from "../src";
import { removeComments, STDINPlugin } from "./utils";

it("expect yaml import to be a json object", async () => {
  const result = await build({
    entryPoints: ["<stdin>"],
    format: "esm",
    write: false,
    bundle: true,
    minifySyntax: false,
    plugins: [
      STDINPlugin(/* ts */ `
        import YAMLConfig from "./yaml-config.yaml";
        console.log(YAMLConfig);
      `),
      YAMLPlugin({}),
    ],
  });

  const text = removeComments(result.outputFiles[0]!.text);

  expect(text).toMatchInlineSnapshot(`
    "var data = {
      "pluginDir": "./plugins",
      "web": {
        "enabled": true
      },
      "logging": {
        "type": "stdout",
        "level": "info"
      }
    };
    var yaml_config_default = data;

    console.log(yaml_config_default);
    "
  `);
});

it("expect yaml import to be a string", async () => {
  const result = await build({
    entryPoints: ["<stdin>"],
    format: "esm",
    write: false,
    bundle: true,
    minifySyntax: false,
    plugins: [
      STDINPlugin(/* ts */ `
        import YAMLConfigRaw from "./yaml-config.yaml?raw";

        console.log(YAMLConfigRaw)
      `),
      YAMLPlugin(),
    ],
  });

  const text = removeComments(result.outputFiles[0]!.text);

  expect(text).toMatchInlineSnapshot(`
    "var yaml_config_default = "pluginDir: ./plugins\\n\\nweb:\\n  enabled: true\\n\\nlogging:\\n  type: stdout\\n  level: info\\n";

    console.log(yaml_config_default);
    "
  `);
});

it("expect yml import to be a json object", async () => {
  const result = await build({
    entryPoints: ["<stdin>"],
    format: "esm",
    write: false,
    bundle: true,
    plugins: [
      STDINPlugin(/* ts */ `
        import YMLConfig from "./yml-config.yml";

        console.log(YMLConfig);
      `),
      YAMLPlugin(),
    ],
  });

  const text = removeComments(result.outputFiles[0]!.text);

  expect(text).toMatchInlineSnapshot(`
    "var data = {
      "pluginDir": "./plugins",
      "web": {
        "enabled": true
      },
      "logging": {
        "type": "stdout",
        "level": "info"
      }
    };
    var yml_config_default = data;

    console.log(yml_config_default);
    "
  `);
});

it("expect yml import to be a string", async () => {
  const result = await build({
    entryPoints: ["<stdin>"],
    format: "esm",
    write: false,
    bundle: true,
    minifySyntax: false,
    plugins: [
      STDINPlugin(/* ts */ `
        import YMLConfigRaw from "./yml-config.yml?raw";

        console.log(YMLConfigRaw)
      `),
      YAMLPlugin(),
    ],
  });

  const text = removeComments(result.outputFiles[0]!.text);

  expect(text).toMatchInlineSnapshot(`
    "var yml_config_default = "pluginDir: ./plugins\\n\\nweb:\\n  enabled: true\\n\\nlogging:\\n  type: stdout\\n  level: info\\n";

    console.log(yml_config_default);
    "
  `);
});

it("handle multi documents yaml files", async () => {
  const result = await build({
    entryPoints: ["<stdin>"],
    format: "esm",
    write: false,
    bundle: true,
    minifySyntax: false,
    plugins: [
      STDINPlugin(/* ts */ `
        import YAMLConfig from "./multi/cronjobs.yaml";

        console.log(YAMLConfig);
      `),
      YAMLPlugin({
        type: "multi",
      }),
    ],
  });

  const text = removeComments(result.outputFiles[0]!.text);

  expect(text).toMatchSnapshot();
});

it("handle transform", async () => {
  const result = await build({
    entryPoints: ["<stdin>"],
    format: "esm",
    write: false,
    bundle: true,
    minifySyntax: false,
    plugins: [
      STDINPlugin(/* ts */ `
        import YAMLConfig from "./yaml-config.yaml";

        console.log(YAMLConfig);
      `),
      YAMLPlugin({
        transform: (data, filePath) => {
          if (filePath.endsWith("yaml-config.yaml") && data != null) {
            return {
              this: "is transformed",
            };
          }
        },
      }),
    ],
  });

  const text = removeComments(result.outputFiles[0]!.text);

  expect(text).toMatchInlineSnapshot(`
    "var data = {
      "this": "is transformed"
    };
    var yaml_config_default = data;

    console.log(yaml_config_default);
    "
  `);
});
