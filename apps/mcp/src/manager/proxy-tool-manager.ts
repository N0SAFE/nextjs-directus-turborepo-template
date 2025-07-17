// ProxyToolManager creates and manages proxy tools that forward calls to backend servers
import { ToolManager } from "./tool-manager.js";
import { BackendServerManager } from "./backend-server-manager.js";
import {
  ToolDefinition,
  ToolCapability,
  ProxyToolDefinition,
  AuthInfo,
  ToolsetConfig,
  DynamicToolDiscoveryOptions,
} from "../types.js";
import { createTool, createToolDefinition } from "../utils/tools.js";
import { z } from "zod";

export class ProxyToolManager extends ToolManager {
  private backendServerManager: BackendServerManager;
  private serverDiscoveryTools: ToolCapability[] = [];

  constructor(
    mcpServerName: string,
    backendServerManager: BackendServerManager,
    toolsetConfig: ToolsetConfig,
    dynamicToolDiscovery?: DynamicToolDiscoveryOptions
  ) {
    // Initialize with server discovery tools
    const discoveryTools = ProxyToolManager.createServerDiscoveryTools(
      mcpServerName,
      backendServerManager
    );

    super(mcpServerName, discoveryTools, toolsetConfig, dynamicToolDiscovery);
    this.backendServerManager = backendServerManager;
    this.serverDiscoveryTools = discoveryTools;

    // Load proxy tools from all connected servers
    this.loadProxyToolsFromServers();

    // Set up auto-refresh when servers change
    this.setupServerChangeHandlers();
  }

  private static createServerDiscoveryTools(
    mcpServerName: string,
    backendServerManager: BackendServerManager
  ): ToolCapability[] {
    const serverListTool = createToolDefinition({
      name: "proxy_server_list",
      description: "List all configured backend MCP servers and their status",
      inputSchema: z.object({
        includeDisabled: z.boolean().optional().describe("Include disabled servers in the list"),
        includeDetails: z.boolean().optional().describe("Include detailed server information"),
      }),
      annotations: {
        title: "List Backend Servers",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    });

    const serverToolsTool = createToolDefinition({
      name: "proxy_server_tools",
      description: "List all tools available from a specific backend server",
      inputSchema: z.object({
        serverId: z.string().describe("ID of the backend server"),
        includeDisabled: z.boolean().optional().describe("Include disabled tools"),
      }),
      annotations: {
        title: "List Server Tools",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    });

    const serverStatusTool = createToolDefinition({
      name: "proxy_server_status",
      description: "Get detailed status information for backend servers",
      inputSchema: z.object({
        serverId: z.string().optional().describe("Specific server ID (if not provided, shows all)"),
      }),
      annotations: {
        title: "Server Status",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    });

    const refreshServerTool = createToolDefinition({
      name: "proxy_server_refresh",
      description: "Refresh capabilities for a specific backend server",
      inputSchema: z.object({
        serverId: z.string().describe("ID of the backend server to refresh"),
      }),
      annotations: {
        title: "Refresh Server",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    });

    return [
      createTool(serverListTool, async (params) => {
        const connections = backendServerManager.getAllConnections();
        const filteredConnections = params.includeDisabled
          ? connections
          : connections.filter(conn => conn.config.enabled);

        const servers = filteredConnections.map(conn => {
          const basic = {
            id: conn.config.id,
            name: conn.config.name,
            description: conn.config.description,
            transportType: conn.config.transportType,
            enabled: conn.config.enabled,
            connected: conn.status.connected,
            toolsCount: conn.status.toolsCount,
          };

          if (params.includeDetails) {
            return {
              ...basic,
              lastConnected: conn.status.lastConnected,
              lastError: conn.status.lastError,
              resourcesCount: conn.status.resourcesCount,
              promptsCount: conn.status.promptsCount,
              security: conn.config.security,
            };
          }

          return basic;
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                servers,
                totalServers: servers.length,
                connectedServers: servers.filter(s => s.connected).length,
              }, null, 2),
            },
          ],
        };
      }),

      createTool(serverToolsTool, async (params) => {
        const connection = backendServerManager.getServerConnection(params.serverId);
        if (!connection) {
          throw new Error(`Server ${params.serverId} not found`);
        }

        const tools = Array.from(connection.tools.values());
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                serverId: params.serverId,
                serverName: connection.config.name,
                connected: connection.status.connected,
                tools: tools.map(tool => ({
                  name: tool.name,
                  description: tool.description,
                  inputSchema: tool.inputSchema,
                })),
                totalTools: tools.length,
              }, null, 2),
            },
          ],
        };
      }),

      createTool(serverStatusTool, async (params) => {
        if (params.serverId) {
          const connection = backendServerManager.getServerConnection(params.serverId);
          if (!connection) {
            throw new Error(`Server ${params.serverId} not found`);
          }
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(connection.status, null, 2),
              },
            ],
          };
        } else {
          const statuses = backendServerManager.getServerStatuses();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  servers: statuses,
                  summary: {
                    total: statuses.length,
                    connected: statuses.filter(s => s.connected).length,
                    disconnected: statuses.filter(s => !s.connected).length,
                  },
                }, null, 2),
              },
            ],
          };
        }
      }),

      createTool(refreshServerTool, async (params) => {
        await backendServerManager.refreshServerCapabilities(params.serverId);
        return {
          content: [
            {
              type: "text",
              text: `Server ${params.serverId} capabilities refreshed`,
            },
          ],
        };
      }),
    ];
  }

  private async loadProxyToolsFromServers() {
    const connections = this.backendServerManager.getConnectedServers();
    const proxyTools: ToolCapability[] = [];

    for (const connection of connections) {
      for (const [toolName, tool] of connection.tools) {
        // Create proxy tool
        const proxyToolName = `${connection.config.id}__${toolName}`;
        const proxyTool = this.createProxyTool(connection.config.id, tool, proxyToolName);
        proxyTools.push(proxyTool);
      }
    }

    // Add proxy tools to the manager
    for (const proxyTool of proxyTools) {
      this.tools.set(proxyTool.definition.name, proxyTool);
      
      // Enable the tool if it should be enabled by default
      if (this.toolsetConfig.mode === "readWrite" || 
          (proxyTool.definition.annotations?.readOnlyHint !== false)) {
        this.enabledTools.add(proxyTool.definition.name);
      }
    }
  }

  private createProxyTool(
    serverId: string,
    originalTool: any,
    proxyToolName: string
  ): ToolCapability {
    const proxyToolDefinition: ProxyToolDefinition = {
      name: proxyToolName,
      description: `[${serverId}] ${originalTool.description}`,
      inputSchema: originalTool.inputSchema,
      annotations: {
        ...originalTool.annotations,
        title: `${originalTool.annotations?.title || originalTool.name} (via ${serverId})`,
      },
      serverId,
      originalName: originalTool.name,
      proxyName: proxyToolName,
    };

    return createTool(proxyToolDefinition, async (params, req, opts) => {
      try {
        const result = await this.backendServerManager.callTool(
          serverId,
          originalTool.name,
          params,
          opts.authInfo
        );
        return result;
      } catch (error) {
        console.error(`Error calling tool ${originalTool.name} on server ${serverId}:`, error);
        return {
          content: [
            {
              type: "text",
              text: `Error calling tool: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private setupServerChangeHandlers() {
    // This would ideally be implemented with event listeners on the BackendServerManager
    // For now, we'll implement a polling mechanism to check for changes
    setInterval(() => {
      this.refreshProxyTools();
    }, 30000); // Check every 30 seconds
  }

  private async refreshProxyTools() {
    // Remove all proxy tools (keep discovery tools)
    const toolsToRemove: string[] = [];
    for (const [toolName, tool] of this.tools) {
      if (!this.serverDiscoveryTools.some(dt => dt.definition.name === toolName)) {
        toolsToRemove.push(toolName);
      }
    }

    for (const toolName of toolsToRemove) {
      this.tools.delete(toolName);
      this.enabledTools.delete(toolName);
    }

    // Reload proxy tools
    await this.loadProxyToolsFromServers();

    // Notify about tool list changes
    this.notifyEnabledToolsChanged();
  }

  async refreshServerTools(serverId: string) {
    // Remove tools for specific server
    const toolsToRemove: string[] = [];
    for (const [toolName, tool] of this.tools) {
      if ('serverId' in tool.definition && tool.definition.serverId === serverId) {
        toolsToRemove.push(toolName);
      }
    }

    for (const toolName of toolsToRemove) {
      this.tools.delete(toolName);
      this.enabledTools.delete(toolName);
    }

    // Reload tools for this server
    const connection = this.backendServerManager.getServerConnection(serverId);
    if (connection && connection.status.connected) {
      for (const [toolName, tool] of connection.tools) {
        const proxyToolName = `${serverId}__${toolName}`;
        const proxyTool = this.createProxyTool(serverId, tool, proxyToolName);
        this.tools.set(proxyTool.definition.name, proxyTool);
        
        if (this.toolsetConfig.mode === "readWrite" || 
            (proxyTool.definition.annotations?.readOnlyHint !== false)) {
          this.enabledTools.add(proxyTool.definition.name);
        }
      }
    }

    this.notifyEnabledToolsChanged();
  }

  protected async notifyEnabledToolsChanged() {
    // Trigger the enabled tools changed callback
    this.enabledToolSubscriptions.forEach(callback => {
      callback({
        tools: Array.from(this.enabledTools)
          .map(toolName => this.tools.get(toolName)!)
          .filter(tool => tool)
          .map(tool => ({
            ...tool.definition,
            inputSchema: tool.definition.inputSchema as any,
          })),
      });
    });
  }
}
