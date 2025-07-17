// Configuration manager for the MCP proxy server
import * as fs from "fs";
import * as path from "path";
import { BackendServerConfig, ProxyServerConfig } from "../types.js";

export class ConfigurationManager {
  private config: ProxyServerConfig;
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || process.env.MCP_PROXY_CONFIG_PATH || "./mcp-proxy-config.json";
    this.config = this.loadConfiguration();
  }

  private loadConfiguration(): ProxyServerConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, "utf-8");
        const parsed = JSON.parse(configData);
        return this.validateAndNormalizeConfig(parsed);
      } else {
        console.log(`Configuration file not found at ${this.configPath}, using default configuration`);
        return this.getDefaultConfiguration();
      }
    } catch (error) {
      console.error(`Error loading configuration from ${this.configPath}:`, error);
      console.log("Using default configuration");
      return this.getDefaultConfiguration();
    }
  }

  private validateAndNormalizeConfig(config: any): ProxyServerConfig {
    if (!config.servers || !Array.isArray(config.servers)) {
      throw new Error("Configuration must have a 'servers' array");
    }

    // Validate server configurations
    for (const server of config.servers) {
      if (!server.id || !server.name || !server.transportType) {
        throw new Error("Each server must have 'id', 'name', and 'transportType'");
      }

      if (!["stdio", "http", "sse"].includes(server.transportType)) {
        throw new Error(`Invalid transport type: ${server.transportType}`);
      }

      // Validate transport-specific configuration
      if (server.transportType === "stdio" && !server.stdio) {
        throw new Error(`Server ${server.id} uses stdio transport but has no stdio configuration`);
      }
      if (server.transportType === "http" && !server.http) {
        throw new Error(`Server ${server.id} uses http transport but has no http configuration`);
      }
      if (server.transportType === "sse" && !server.sse) {
        throw new Error(`Server ${server.id} uses sse transport but has no sse configuration`);
      }

      // Set defaults
      if (server.enabled === undefined) {
        server.enabled = true;
      }
    }

    return {
      servers: config.servers,
      security: config.security || {},
      discovery: config.discovery || { enabled: true },
    };
  }

  private getDefaultConfiguration(): ProxyServerConfig {
    return {
      servers: [],
      security: {
        allowServerDiscovery: true,
        defaultRequireAuth: false,
      },
      discovery: {
        enabled: true,
        allowRuntimeServerAddition: false,
        serverMetadataExposure: "basic",
      },
    };
  }

  getConfiguration(): ProxyServerConfig {
    return this.config;
  }

  updateConfiguration(newConfig: ProxyServerConfig): void {
    this.config = this.validateAndNormalizeConfig(newConfig);
    this.saveConfiguration();
  }

  getServers(): BackendServerConfig[] {
    return this.config.servers;
  }

  addServer(serverConfig: BackendServerConfig): void {
    // Check if server ID already exists
    if (this.config.servers.find(s => s.id === serverConfig.id)) {
      throw new Error(`Server with ID ${serverConfig.id} already exists`);
    }

    this.config.servers.push(serverConfig);
    this.saveConfiguration();
  }

  removeServer(serverId: string): void {
    const index = this.config.servers.findIndex(s => s.id === serverId);
    if (index === -1) {
      throw new Error(`Server with ID ${serverId} not found`);
    }

    this.config.servers.splice(index, 1);
    this.saveConfiguration();
  }

  updateServer(serverId: string, updates: Partial<BackendServerConfig>): void {
    const server = this.config.servers.find(s => s.id === serverId);
    if (!server) {
      throw new Error(`Server with ID ${serverId} not found`);
    }

    // Don't allow changing the ID
    if (updates.id && updates.id !== serverId) {
      throw new Error("Cannot change server ID");
    }

    Object.assign(server, updates);
    this.saveConfiguration();
  }

  enableServer(serverId: string): void {
    this.updateServer(serverId, { enabled: true });
  }

  disableServer(serverId: string): void {
    this.updateServer(serverId, { enabled: false });
  }

  updateSecurity(security: ProxyServerConfig["security"]): void {
    this.config.security = { ...this.config.security, ...security };
    this.saveConfiguration();
  }

  updateDiscovery(discovery: Partial<ProxyServerConfig["discovery"]>): void {
    this.config.discovery = { 
      enabled: true,
      allowRuntimeServerAddition: true,
      serverMetadataExposure: 'basic',
      ...this.config.discovery, 
      ...discovery 
    };
    this.saveConfiguration();
  }

  private saveConfiguration(): void {
    try {
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      console.log(`Configuration saved to ${this.configPath}`);
    } catch (error) {
      console.error(`Error saving configuration to ${this.configPath}:`, error);
      throw error;
    }
  }

  reloadConfiguration(): void {
    this.config = this.loadConfiguration();
  }

  // Environment variable support
  static createFromEnvironment(): ConfigurationManager {
    const servers: BackendServerConfig[] = [];

    // Look for environment variables like MCP_SERVER_1_ID, MCP_SERVER_1_NAME, etc.
    let serverIndex = 1;
    while (true) {
      const idKey = `MCP_SERVER_${serverIndex}_ID`;
      const id = process.env[idKey];
      
      if (!id) break;

      const nameKey = `MCP_SERVER_${serverIndex}_NAME`;
      const transportKey = `MCP_SERVER_${serverIndex}_TRANSPORT`;
      const enabledKey = `MCP_SERVER_${serverIndex}_ENABLED`;
      
      const name = process.env[nameKey] || id;
      const transportType = process.env[transportKey] as BackendServerConfig["transportType"];
      const enabled = process.env[enabledKey] !== "false";

      if (!transportType || !["stdio", "http", "sse"].includes(transportType)) {
        console.warn(`Invalid or missing transport type for server ${id}, skipping`);
        serverIndex++;
        continue;
      }

      const serverConfig: BackendServerConfig = {
        id,
        name,
        transportType,
        enabled,
        description: process.env[`MCP_SERVER_${serverIndex}_DESCRIPTION`],
      };

      // Add transport-specific configuration
      if (transportType === "stdio") {
        const command = process.env[`MCP_SERVER_${serverIndex}_COMMAND`];
        if (!command) {
          console.warn(`Missing command for stdio server ${id}, skipping`);
          serverIndex++;
          continue;
        }

        serverConfig.stdio = {
          command,
          args: process.env[`MCP_SERVER_${serverIndex}_ARGS`]?.split(",") || [],
        };

        // Add environment variables
        const envVars: Record<string, string> = {};
        let envIndex = 1;
        while (true) {
          const envKey = process.env[`MCP_SERVER_${serverIndex}_ENV_${envIndex}_KEY`];
          const envValue = process.env[`MCP_SERVER_${serverIndex}_ENV_${envIndex}_VALUE`];
          
          if (!envKey || !envValue) break;
          
          envVars[envKey] = envValue;
          envIndex++;
        }
        
        if (Object.keys(envVars).length > 0) {
          serverConfig.stdio.env = envVars;
        }
      } else if (transportType === "http") {
        const url = process.env[`MCP_SERVER_${serverIndex}_URL`];
        if (!url) {
          console.warn(`Missing URL for HTTP server ${id}, skipping`);
          serverIndex++;
          continue;
        }

        serverConfig.http = { url };
      } else if (transportType === "sse") {
        const url = process.env[`MCP_SERVER_${serverIndex}_URL`];
        if (!url) {
          console.warn(`Missing URL for SSE server ${id}, skipping`);
          serverIndex++;
          continue;
        }

        serverConfig.sse = { url };
      }

      servers.push(serverConfig);
      serverIndex++;
    }

    // Create a temporary config file
    const tempConfig: ProxyServerConfig = {
      servers,
      security: {
        allowServerDiscovery: process.env.MCP_PROXY_ALLOW_DISCOVERY !== "false",
        defaultRequireAuth: process.env.MCP_PROXY_REQUIRE_AUTH === "true",
      },
      discovery: {
        enabled: process.env.MCP_PROXY_DISCOVERY_ENABLED !== "false",
        allowRuntimeServerAddition: process.env.MCP_PROXY_ALLOW_RUNTIME_ADDITION === "true",
        serverMetadataExposure: (process.env.MCP_PROXY_METADATA_EXPOSURE as any) || "basic",
      },
    };

    const configManager = new ConfigurationManager();
    configManager.config = tempConfig;
    return configManager;
  }

  // Generate example configuration
  static generateExampleConfig(filePath: string): void {
    const exampleConfig: ProxyServerConfig = {
      servers: [
        {
          id: "weather-server",
          name: "Weather MCP Server",
          description: "Provides weather information via external APIs",
          transportType: "stdio",
          enabled: true,
          stdio: {
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-weather"],
            env: {
              "WEATHER_API_KEY": "your-weather-api-key-here",
            },
          },
          security: {
            allowedTools: ["get_weather", "get_forecast"],
            requireAuth: false,
          },
        },
        {
          id: "file-server",
          name: "File System MCP Server",
          description: "Provides file system access",
          transportType: "stdio",
          enabled: true,
          stdio: {
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"],
          },
          security: {
            blockedTools: ["write_file", "delete_file"],
            requireAuth: true,
            allowedScopes: ["read"],
          },
        },
        {
          id: "remote-server",
          name: "Remote MCP Server",
          description: "Remote MCP server via SSE",
          transportType: "sse",
          enabled: false,
          sse: {
            url: "https://example.com/mcp-sse",
            headers: {
              "Authorization": "Bearer your-token-here",
            },
          },
          security: {
            requireAuth: true,
            allowedScopes: ["mcp:read", "mcp:write"],
          },
        },
      ],
      security: {
        globalBlockedTools: ["dangerous_operation"],
        allowServerDiscovery: true,
        defaultRequireAuth: false,
      },
      discovery: {
        enabled: true,
        allowRuntimeServerAddition: false,
        serverMetadataExposure: "basic",
      },
    };

    const configDir = path.dirname(filePath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(exampleConfig, null, 2));
    console.log(`Example configuration generated at ${filePath}`);
  }
}
