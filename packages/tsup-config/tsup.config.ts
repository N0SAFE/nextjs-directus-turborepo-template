import defineTsupConfig from "./src";

export default defineTsupConfig((options) => ({
  entry: ["./src/**/*.{ts,tsx}"],
  format: ["esm", "cjs"],
  clean: true,
  minify: true,
  external: ["react", "react-dom"],
  ...options,
}));
