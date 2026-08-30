import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  // The library is client-only (it mutates document.head); the directive
  // gives Next.js App Router a clean client boundary when server code
  // imports the hook
  banner: { js: '"use client";' },
  dts: {
    compilerOptions: {
      // tsup forces baseUrl for its dts bundling; TypeScript 6 rejects the
      // deprecated option without this escape hatch
      ignoreDeprecations: "6.0",
    },
  },
  clean: true,
});
