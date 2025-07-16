// Main MCP Proxy Server class
import { McpServer } from "../mcp-server.js";
import { BackendServerManager } from "./backend-server-manager.js";
import { ProxyToolManager } from "./proxy-tool-manager.js";
import { ConfigurationManager } from "./configuration-manager.js";
import {
  ToolsetConfig,
  DynamicToolDiscoveryOptions,
  ProxyServerConfig,
} from "../types.js";
import { createTool, createToolDefinition } from "../utils/tools.js";
import { z } from "zod";

export class ProxyMcpServer extends McpServer {
  private backendServerManager: BackendServerManager;
  private configurationManager: ConfigurationManager;
  private proxyToolManager: ProxyToolManager;

  constructor({
    name,
    version,
    toolsetConfig,
    dynamicToolDiscovery,
    instructions,
    configurationManager,
  }: {
    name: string;
    version: string;
    toolsetConfig: ToolsetConfig;
    dynamicToolDiscovery?: DynamicToolDiscoveryOptions;
    instructions?: string;
    configurationManager?: ConfigurationManager;
  }) {
    // Initialize configuration manager
    const configMgr = configurationManager || new ConfigurationManager();
    const proxyConfig = configMgr.getConfiguration();

    // Initialize backend server manager
    const backendServerManager = new BackendServerManager(proxyConfig.servers);

    // Initialize proxy tool manager
    const proxyToolManager = new ProxyToolManager(
      name,
      backendServerManager,
      toolsetConfig,
      dynamicToolDiscovery
    );

    // Create server management tools
    const serverManagementTools = ProxyMcpServer.createServerManagementTools(
      configMgr,
      backendServerManager,
      proxyToolManager
    );

    // Combine with existing proxy tools
    const allTools = [...serverManagementTools];

    // Enhanced instructions for proxy server
    const proxyInstructions = `
# MCP Proxy Server

This is an MCP proxy server that provides access to multiple backend MCP servers through a unified interface.

## Available Capabilities:

### Server Management:
- \`proxy_server_list\`: List all configured backend servers and their status
- \`proxy_server_tools\`: List tools available from a specific backend server
- \`proxy_server_status\`: Get detailed status information for backend servers
- \`proxy_server_refresh\`: Refresh capabilities for a specific backend server
- \`proxy_config_add_server\`: Add a new backend server to the configuration
- \`proxy_config_remove_server\`: Remove a backend server from the configuration
- \`proxy_config_enable_server\`: Enable a backend server
- \`proxy_config_disable_server\`: Disable a backend server

### Backend Server Tools:
All tools from connected backend servers are exposed with the format: \`{serverId}__{toolName}\`

For example, if a server with ID "weather" has a tool called "get_forecast", it will be available as "weather__get_forecast".

### Security:
- Each backend server can have its own security configuration
- Tools can be allowed/blocked per server
- Authentication requirements can be configured per server
- Global security policies can be applied

Use the server management tools to discover available backend servers and their capabilities.

${instructions || ""}`;

    super({
      name,
      version,
      capabilities: {
        tools: allTools,
      },
      toolsetConfig,
      dynamicToolDiscovery,
      instructions: proxyInstructions,
    });

    this.configurationManager = configMgr;
    this.backendServerManager = backendServerManager;
    this.proxyToolManager = proxyToolManager;

    // Set up cleanup on shutdown
    process.on("SIGTERM", () => this.shutdown());
    process.on("SIGINT", () => this.shutdown());
  }

  private static createServerManagementTools(
    configManager: ConfigurationManager,
    backendServerManager: BackendServerManager,
    proxyToolManager: ProxyToolManager
  ) {
    const addServerTool = createToolDefinition({
      name: "proxy_config_add_server",
      description: "Add a new backend MCP server to the configuration",
      inputSchema: z.object({
        id: z.string().describe("Unique identifier for the server"),
        name: z.string().describe("Human-readable name for the server"),
        description: z.string().optional().describe("Description of the server"),
        transportType: z.enum(["stdio", "http", "sse"]).describe("Transport type to use"),
        enabled: z.boolean().optional().default(true).describe("Whether to enable the server immediately"),
        stdio: z.object({
          command: z.string().describe("Command to execute"),
          args: z.array(z.string()).optional().describe("Command arguments"),
          env: z.record(z.string()).optional().describe("Environment variables"),
        }).optional(),
        http: z.object({
          url: z.string().describe("HTTP endpoint URL"),
          headers: z.record(z.string()).optional().describe("HTTP headers"),
          timeout: z.number().optional().describe("Request timeout in milliseconds"),
        }).optional(),
        sse: z.object({
          url: z.string().describe("SSE endpoint URL"),
          headers: z.record(z.string()).optional().describe("HTTP headers"),
          timeout: z.number().optional().describe("Connection timeout in milliseconds"),
        }).optional(),
        security: z.object({
          allowedTools: z.array(z.string()).optional().describe("List of allowed tool names"),
          blockedTools: z.array(z.string()).optional().describe("List of blocked tool names"),
          requireAuth: z.boolean().optional().describe("Whether authentication is required"),
          allowedScopes: z.array(z.string()).optional().describe("Required authentication scopes"),
        }).optional(),
      }),
      annotations: {
        title: "Add Backend Server",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    });

    const removeServerTool = createToolDefinition({
      name: "proxy_config_remove_server",
      description: "Remove a backend MCP server from the configuration",
      inputSchema: z.object({
        serverId: z.string().describe("ID of the server to remove"),
      }),
      annotations: {
        title: "Remove Backend Server",
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    });

    const enableServerTool = createToolDefinition({
      name: "proxy_config_enable_server",
      description: "Enable a backend MCP server",
      inputSchema: z.object({
        serverId: z.string().describe("ID of the server to enable"),
      }),
      annotations: {
        title: "Enable Backend Server",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    });

    const disableServerTool = createToolDefinition({
      name: "proxy_config_disable_server",
      description: "Disable a backend MCP server",
      inputSchema: z.object({
        serverId: z.string().describe("ID of the server to disable"),
      }),
      annotations: {
        title: "Disable Backend Server",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    });

    return [
      createTool(addServerTool, async (params) => {
        try {
          const serverConfig = {
            id: params.id,
            name: params.name,
            description: params.description,
            transportType: params.transportType,
            enabled: params.enabled,
            stdio: params.stdio,
            http: params.http,
            sse: params.sse,
            security: params.security,
          };

          configManager.addServer(serverConfig as any);
          
          if (params.enabled) {
            await backendServerManager.addServer(serverConfig as any);
            await proxyToolManager.refreshServerTools(params.id);
          }

          return {
            content: [
              {
                type: "text",
                text: `Server ${params.id} added successfully`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error adding server: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }),

      createTool(removeServerTool, async (params) => {
        try {
          await backendServerManager.removeServer(params.serverId);
          configManager.removeServer(params.serverId);
          await proxyToolManager.refreshServerTools(params.serverId);

          return {
            content: [
              {
                type: "text",
                text: `Server ${params.serverId} removed successfully`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error removing server: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }),

      createTool(enableServerTool, async (params) => {
        try {
          configManager.enableServer(params.serverId);
          await backendServerManager.enableServer(params.serverId);
          await proxyToolManager.refreshServerTools(params.serverId);

          return {
            content: [
              {
                type: "text",
                text: `Server ${params.serverId} enabled successfully`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error enabling server: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }),

      createTool(disableServerTool, async (params) => {
        try {
          configManager.disableServer(params.serverId);
          await backendServerManager.disableServer(params.serverId);
          await proxyToolManager.refreshServerTools(params.serverId);

          return {
            content: [
              {
                type: "text",
                text: `Server ${params.serverId} disabled successfully`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error disabling server: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }),
    ];
  }

  private async shutdown() {
    console.log("Shutting down MCP Proxy Server...");
    try {
      await this.backendServerManager.shutdown();
      await this.server.close();
      console.log("MCP Proxy Server shut down successfully");
    } catch (error) {
      console.error("Error during shutdown:", error);
    }
    process.exit(0);
  }

  // Getters for access to managers
  get backend() {
    return this.backendServerManager;
  }

  get config() {
    return this.configurationManager;
  }

  get tools() {
    return this.proxyToolManager;
  }
}
