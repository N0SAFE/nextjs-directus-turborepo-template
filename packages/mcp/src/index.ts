import { McpConfig, ToolCapability } from "types.js";
import { McpServer } from "./mcp-server.js";
import { ProxyMcpServer } from "./manager/proxy-mcp-server.js";
import { ConfigurationManager } from "./manager/configuration-manager.js";

const tools = [] as ToolCapability[];

export class MainMcpServer extends McpServer {
  constructor(config: McpConfig) {
    super({
      name: "main-mcp-server",
      version: "1.0.0",
      toolsetConfig: config.toolsetConfig || { mode: "readWrite" },
      capabilities: {
        tools:
          config.availableTools?.length ? config.availableTools?.length > 0
            ? tools.filter((tool) =>
                config.availableTools?.includes(tool.definition.name)
              )
            : tools : tools,
      },
      dynamicToolDiscovery: config.dynamicToolDiscovery || { enabled: true },
    });
  }
}

// Export the new ProxyMcpServer as the main server implementation
export { ProxyMcpServer, ConfigurationManager };