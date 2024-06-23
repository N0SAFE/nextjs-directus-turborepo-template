#!/usr/bin/env node

import process from "process";
import dotenv from "dotenv";

import { spawnSync } from "child_process";

dotenv.config();
const argv = process.argv.slice(2);

spawnSync(
  argv
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
    .join(""),
  {
    stdio: "inherit",
    shell: true,
  },
);
