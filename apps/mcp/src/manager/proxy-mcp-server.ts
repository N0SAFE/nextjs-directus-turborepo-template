// Main MCP Proxy Server class
import { McpServer } from "../mcp-server.js";
import { BackendServerManager } from "./backend-server-manager.js";
import { ProxyToolManager } from "./proxy-tool-manager.js";
import { ConfigurationManager } from "./configuration-manager.js";
import { DynamicServerCreator } from "./dynamic-server-creator.js";
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
  private dynamicServerCreator: DynamicServerCreator;

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

    // Initialize dynamic server creator
    const dynamicServerCreator = new DynamicServerCreator();

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

    // Create dynamic server creation tools
    const dynamicServerTools = ProxyMcpServer.createDynamicServerTools(
      dynamicServerCreator,
      configMgr,
      backendServerManager,
      proxyToolManager
    );

    // Combine with existing proxy tools
    const allTools = [...serverManagementTools, ...dynamicServerTools];

    // Enhanced instructions for proxy server
    const proxyInstructions = `
# MCP Proxy Server

This is an MCP proxy server that provides access to multiple backend MCP servers through a unified interface.

## Available Capabilities:

### Dynamic Server Creation:
- \`proxy_create_custom_server\`: Create new MCP servers from natural language instructions
- \`proxy_list_generated_servers\`: List all dynamically created servers
- \`proxy_remove_generated_server\`: Remove a dynamically created server

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
    this.dynamicServerCreator = dynamicServerCreator;

    // Set up cleanup on shutdown
    process.on("SIGTERM", () => this.shutdownProxy());
    process.on("SIGINT", () => this.shutdownProxy());
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

  private static createDynamicServerTools(
    dynamicServerCreator: DynamicServerCreator,
    configManager: ConfigurationManager,
    backendServerManager: BackendServerManager,
    proxyToolManager: ProxyToolManager
  ) {
    const createCustomServerTool = createToolDefinition({
      name: "proxy_create_custom_server",
      description: "Create a new MCP server from natural language instructions. Supports OpenAPI/REST APIs, webhooks, databases, and custom servers.",
      inputSchema: z.object({
        instructions: z.string().describe("Natural language instructions describing what kind of MCP server to create and what it should do"),
        serverId: z.string().optional().describe("Optional custom server ID (if not provided, one will be generated)"),
        serverType: z.enum(["openapi", "webhook", "database", "custom"]).optional().describe("Specific server type to create (auto-detected if not provided)"),
        configuration: z.object({
          openApiUrl: z.string().optional().describe("URL to OpenAPI/Swagger specification"),
          openApiSpec: z.any().optional().describe("OpenAPI specification as JSON object"),
          baseUrl: z.string().optional().describe("Base URL for API calls"),
          apiKey: z.string().optional().describe("API key for authentication"),
          webhookUrl: z.string().optional().describe("Webhook endpoint URL"),
          webhookSecret: z.string().optional().describe("Webhook secret for authentication"),
          connectionString: z.string().optional().describe("Database connection string"),
          databaseType: z.string().optional().describe("Database type (postgresql, mysql, sqlite, etc.)"),
          schema: z.string().optional().describe("Database schema name"),
          command: z.string().optional().describe("Command to execute for custom servers"),
          args: z.array(z.string()).optional().describe("Command arguments"),
          serverCode: z.string().optional().describe("Custom server code (JavaScript/Node.js)"),
          env: z.record(z.string()).optional().describe("Environment variables"),
          requireAuth: z.boolean().optional().describe("Whether the server requires authentication"),
        }).optional().describe("Server-specific configuration options"),
      }),
      annotations: {
        title: "Create Custom MCP Server",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    });

    const listGeneratedServersTool = createToolDefinition({
      name: "proxy_list_generated_servers",
      description: "List all dynamically created MCP servers",
      inputSchema: z.object({
        includeInstructions: z.boolean().optional().describe("Include the original instructions used to create each server"),
      }),
      annotations: {
        title: "List Generated Servers",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    });

    const removeGeneratedServerTool = createToolDefinition({
      name: "proxy_remove_generated_server",
      description: "Remove a dynamically created MCP server",
      inputSchema: z.object({
        serverId: z.string().describe("ID of the generated server to remove"),
      }),
      annotations: {
        title: "Remove Generated Server",
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    });

    return [
      createTool(createCustomServerTool, async (params) => {
        try {
          // Parse instructions if configuration is not fully specified
          let instructions;
          if (params.configuration && Object.keys(params.configuration).length > 0) {
            // Use provided configuration
            instructions = {
              serverType: params.serverType || "custom",
              description: params.instructions,
              capabilities: [], // Will be inferred from serverType
              configuration: params.configuration,
            };
          } else {
            // Parse from natural language instructions
            instructions = dynamicServerCreator.parseInstructions(params.instructions);
          }

          // Override serverType if explicitly provided
          if (params.serverType) {
            instructions.serverType = params.serverType;
          }

          // Create the server
          const serverConfig = await dynamicServerCreator.createServerFromInstructions(
            instructions,
            params.serverId
          );

          // Add to configuration and backend manager
          configManager.addServer(serverConfig);
          await backendServerManager.addServer(serverConfig);
          
          // Refresh proxy tools to include tools from the new server
          setTimeout(async () => {
            await proxyToolManager.refreshServerTools(serverConfig.id);
          }, 2000); // Give the server time to start

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  serverId: serverConfig.id,
                  serverName: serverConfig.name,
                  description: serverConfig.description,
                  serverType: instructions.serverType,
                  capabilities: instructions.capabilities,
                  message: `Successfully created ${instructions.serverType} MCP server '${serverConfig.name}' with ID '${serverConfig.id}'. The server will be available for use once it finishes initializing.`
                }, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : String(error),
                  message: "Failed to create custom MCP server. Please check your instructions and configuration."
                }, null, 2),
              },
            ],
          };
        }
      }),

      createTool(listGeneratedServersTool, async (params) => {
        try {
          const generatedServers = dynamicServerCreator.listGeneratedServers();
          
          const serverList = generatedServers.map(server => {
            const basic = {
              id: server.id,
              name: server.name,
              description: server.description,
              serverType: server.instructions.serverType,
              enabled: server.enabled,
              generatedAt: server.generatedAt,
              capabilities: server.instructions.capabilities,
            };

            if (params.includeInstructions) {
              return {
                ...basic,
                originalInstructions: server.instructions.description,
                configuration: server.instructions.configuration,
              };
            }

            return basic;
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  generatedServers: serverList,
                  totalGenerated: serverList.length,
                  summary: {
                    byType: serverList.reduce((acc, server) => {
                      acc[server.serverType] = (acc[server.serverType] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>),
                  },
                }, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error listing generated servers: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }),

      createTool(removeGeneratedServerTool, async (params) => {
        try {
          const server = dynamicServerCreator.getGeneratedServer(params.serverId);
          if (!server) {
            return {
              content: [
                {
                  type: "text",
                  text: `Generated server ${params.serverId} not found`,
                },
              ],
            };
          }

          // Remove from backend manager and configuration
          await backendServerManager.removeServer(params.serverId);
          configManager.removeServer(params.serverId);
          
          // Remove from dynamic server creator
          dynamicServerCreator.removeGeneratedServer(params.serverId);
          
          // Refresh proxy tools
          await proxyToolManager.refreshServerTools(params.serverId);

          return {
            content: [
              {
                type: "text",
                text: `Generated server ${params.serverId} removed successfully`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error removing generated server: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }),
    ];
  }

  private async shutdownProxy() {
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

  get serverCreator() {
    return this.dynamicServerCreator;
  }
}
