import { build } from "esbuild";
import { expect, it } from "vitest";

import YAMLPlugin from "../src";
import { STDINPlugin, removeComments } from "./utils";

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
      YAMLPlugin(),
    ],
  });

  const text = removeComments(result.outputFiles[0].text);

  expect(text).toMatchInlineSnapshot(`
  "var yaml_config_default = { pluginDir: "./plugins", web: { enabled: true }, logging: { type: "stdout", level: "info" } };
  
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

  const text = removeComments(result.outputFiles[0].text);

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

  const text = removeComments(result.outputFiles[0].text);

  expect(text).toMatchInlineSnapshot(`
  "var yml_config_default = { pluginDir: "./plugins", web: { enabled: true }, logging: { type: "stdout", level: "info" } };
  
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

  const text = removeComments(result.outputFiles[0].text);

  expect(text).toMatchInlineSnapshot(`
    "var yml_config_default = "pluginDir: ./plugins\\n\\nweb:\\n  enabled: true\\n\\nlogging:\\n  type: stdout\\n  level: info\\n";

    console.log(yml_config_default);
    "
  `);
});
