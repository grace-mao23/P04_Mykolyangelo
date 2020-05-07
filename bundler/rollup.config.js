import resolve from '@rollup/plugin-node-resolve';

export default [{
  input: "src/d3.main.js",
  output: {
    name: "d3",
    file: "dist/d3.js",
    format: "umd"
  },
  plugins: [resolve()]
}, {
  input: "src/topojson.main.js",
  output: {
    name: "topojson",
    file: "dist/topojson.js",
    format: "umd"
  },
  plugins: [resolve()]
}];