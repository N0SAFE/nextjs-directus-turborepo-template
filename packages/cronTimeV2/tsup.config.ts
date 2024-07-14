import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["./src/**/*.ts"],
  format: ["cjs", "esm"],
  clean: true,
  minify: true,
  ...options,
}));
