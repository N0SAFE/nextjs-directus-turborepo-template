import defineTsupConfig from "@repo/tsup-config";

export default defineTsupConfig((options) => ({
  entry: ["./src/**/*.{ts,tsx}"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  minify: true,
  external: ["react", "react-dom"],
  ...options,
}));
