import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["cjs", "esm"],
  clean: true,
  dts: {
    banner: "/// <reference path=\"../yaml.d.ts\" />",
  },
  treeshake: true,
  bundle: true,
  outExtension(ctx) {
    return {
      js: ctx.format === "cjs" ? ".cjs" : ".mjs",
    };
  },
  footer: {
    js: "module.exports = module.exports.default;",
  },
  cjsInterop: true,
});
