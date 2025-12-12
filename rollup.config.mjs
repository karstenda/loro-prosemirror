import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import resolve from "@rollup/plugin-node-resolve";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json"));

const name = packageJson.main.replace(/\.js$/, "");

// Plugin to remove .ts extensions from import/export/require statements
const removeTsExtensions = () => ({
  name: 'remove-ts-extensions',
  renderChunk(code) {
    // Remove .ts extensions from import/export statements (ES modules)
    let newCode = code.replace(/from\s+['"](.+?)\.ts['"]/g, "from '$1'");
    newCode = newCode.replace(/import\s+['"](.+?)\.ts['"]/g, "import '$1'");
    // Remove .ts extensions from require statements (CommonJS)
    newCode = newCode.replace(/require\(['"](.+?)\.ts['"]\)/g, "require('$1')");
    return newCode;
  },
});

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id, importer) => {
    // Don't mark entry point as external
    if (!importer) return false;
    // Only mark peer dependencies and dependencies as external
    return !/^[./]/.test(id);
  },
});

export default defineConfig([
  bundle({
    plugins: [
      resolve({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      }),
      esbuild({
        target: 'esnext',
      }),
      removeTsExtensions(),
    ],
    output: [
      {
        file: `${name}.js`,
        format: "cjs",
        sourcemap: true,
        exports: 'named',
        externalLiveBindings: false,
        freeze: false,
      },
      {
        file: `${name}.mjs`,
        format: "es",
        sourcemap: true,
        externalLiveBindings: false,
        freeze: false,
      },
    ],
  }),
  bundle({
    plugins: [
      dts({
        compilerOptions: {
          preserveSymlinks: false,
        },
      }),
    ],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  }),
]);
