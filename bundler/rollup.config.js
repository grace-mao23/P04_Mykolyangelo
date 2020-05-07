import resolve from '@rollup/plugin-node-resolve';

export default {
  input: "src/main.js",
  output: {
    name: "bundle",
    file: "bundle.js",
    format: "umd"
  },
  plugins: [resolve()]
};