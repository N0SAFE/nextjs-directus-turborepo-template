import { Command } from "commander";
import { McpConfig } from "../types";
import { z } from "zod";

const program = new Command();
program
  .option(
    "--enable-dynamic-tool-discovery",
    "Enable dynamic tool discovery (boolean)"
  )
  .option(
    "--default-enable-tool <tools>",
    "Comma-separated list of tools to enable by default (only with dynamic tool discovery)"
  )
  .option("--read-only", "Set toolset to readOnly mode (boolean)")
  .option(
    "--available-tools <tools>",
    "Comma-separated list of available tools (restricts which tools can be enabled)"
  );

const optionsSchema = z.object({
  enableDynamicToolDiscovery: z.boolean().optional(),
  defaultEnableTool: z
    .string()
    .optional()
    .transform((val) => {
      if (typeof val === "string") {
        return val
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
      return [];
    }),
  readOnly: z.boolean().optional(),
  availableTools: z
    .string()
    .optional()
    .transform((val) => {
      if (typeof val === "string") {
        return val
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
      return [];
    }),
});

function getConfigFromCommander(
  opts: z.infer<typeof optionsSchema>
): McpConfig {
  // Parse booleans
  const enableDynamicToolDiscovery = !!opts.enableDynamicToolDiscovery;
  const readOnly = !!opts.readOnly;

  return {
    toolsetConfig: { mode: readOnly ? "readOnly" : "readWrite" },
    availableTools: opts.availableTools,
    dynamicToolDiscovery: enableDynamicToolDiscovery
      ? { enabled: true, defaultEnabledToolsets: opts.defaultEnableTool }
      : { enabled: false },
  };
}

function getConfig(params: McpConfig) {
  return {
    toolsetConfig:
      params.toolsetConfig ??
      (process.env.MCP_SERVER_TOOLSET_CONFIG
        ? JSON.parse(process.env.MCP_SERVER_TOOLSET_CONFIG)
        : undefined),
    availableTools:
      params.availableTools ??
      (process.env.MCP_SERVER_AVAILABLE_TOOLS
        ? process.env.MCP_SERVER_AVAILABLE_TOOLS.split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : undefined),
    dynamicToolDiscovery:
      params.dynamicToolDiscovery ??
      (process.env.MCP_SERVER_DYNAMIC_TOOL_DISCOVERY
        ? JSON.parse(process.env.MCP_SERVER_DYNAMIC_TOOL_DISCOVERY)
        : undefined),
  };
}

export function getConfigFromCommanderAndEnv(): McpConfig {
  program.parse(process.argv);
  const opts = program.opts();
  const parsedOpts = optionsSchema.safeParse(opts);
  if (!parsedOpts.success) {
    console.error("Invalid options:", parsedOpts.error.format());
    process.exit(1);
  }

  const config = getConfig(getConfigFromCommander(parsedOpts.data));

  return config
}
