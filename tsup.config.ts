import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    compilerOptions: {
      // tsup forces baseUrl for its dts bundling; TypeScript 6 rejects the
      // deprecated option without this escape hatch
      ignoreDeprecations: "6.0",
    },
  },
  clean: true,
});
