#!/usr/bin/env node

import process from "process";
import dotenv from "dotenv";
import fs from "fs";

import { spawnSync } from "child_process";

const nodeEnv = process.env.NODE_ENV || "development";

if (fs.existsSync(`.env.${nodeEnv}`)) {
  dotenv.config({ path: `.env.${nodeEnv}` });
} else if (fs.existsSync(`.env.${nodeEnv}.local`)) {
  dotenv.config({ path: `.env.${nodeEnv}.local` });
} else if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

const argv = process.argv.slice(2);

const toRun = argv
  .join(" ")
  .split(/(\{[^{}]*\})/)
  .map((s, i, a) =>
    s.startsWith("{")
      ? `$${s}`
      : s.endsWith("$") && a[i + 1].startsWith("{") && a[i + 1].endsWith("}")
        ? s.slice(0, -1)
        : s,
  )
  .map((s) =>
    s.startsWith("${") && s.endsWith("}") ? process.env[s.slice(2, -1)] : s,
  )
  .join("");

if (!toRun) {
  throw new Error("No command to run");
}

spawnSync(toRun, {
  stdio: "inherit",
  shell: true,
});
