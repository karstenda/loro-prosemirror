import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "LoroProseMirror",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
    },
    rollupOptions: {
      external: [
        "loro-crdt",
        "prosemirror-model",
        "prosemirror-state",
        "prosemirror-view",
        "lib0",
      ],
      output: {
        exports: "named",
        preserveModules: false,
      },
    },
    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
