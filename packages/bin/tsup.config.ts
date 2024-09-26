import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["./src/**/*.ts"],
  format: ["cjs"],
  clean: false,
  minify: true,
  ...options,
}));
