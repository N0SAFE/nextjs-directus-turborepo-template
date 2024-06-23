import { defineConfig } from "tsup";

export default function defineTsupConfig(
  callback?: (
    options: Parameters<typeof defineConfig>[0],
  ) => ReturnType<typeof defineConfig>,
) {
  return defineConfig((o) => ({
    entry: ["./src/**/*.{ts,tsx}"],
    format: ["esm"],
    minify: true,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    ...(callback ? callback(o) : o), // merge user options with default options
  }));
}
