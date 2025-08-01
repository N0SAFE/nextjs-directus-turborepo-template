import { build } from "esbuild";
import alias from "esbuild-plugin-alias";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/index.js",
  platform: "node",
  target: "node18",
  format: "esm",
  sourcemap: !isProduction,
  minify: isProduction,
  external: [
    "postgres",
    "drizzle-orm",
    "better-auth",
    "zod",
    "bcrypt",
    "date-fns",
    "nanoid"
  ],
  plugins: [
    alias({
      "#": path.resolve("src"),
      "@": path.resolve("src"),
    }),
  ],
});

console.log("📦 Server package built successfully!");