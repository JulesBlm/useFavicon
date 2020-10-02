import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from "./package.json";

export default {
  input: "src/index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    //   sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
    //   sourcemap: true,
    },
    {
      file: pkg.module,
      format: "esm",
    //   sourcemap: true,
    },
  ],
  plugins: [
    babel({ babelHelpers: "bundled" }),
    nodeResolve(),
    commonjs(),
  ],
};
