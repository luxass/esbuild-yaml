// yaml:/workspaces/esbuild-yaml/test/shared/configs/default.yaml
var default_default =
  'pluginDir: ./plugins\n\nweb:\n  enabled: true\n\nlogging:\n  type: stdout\n  level: info\n';

// test/shared/config-utils.ts
function getDefaultConfig() {
  return default_default;
}
export { getDefaultConfig };
