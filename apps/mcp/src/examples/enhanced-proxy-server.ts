#!/usr/bin/env node

/**
 * Enhanced MCP Proxy Server Example
 * 
 * This example demonstrates a fully-featured MCP proxy server that:
 * 1. Acts as a reverse proxy for multiple MCP backend servers
 * 2. Provides dynamic tool discovery and management
 * 3. Supports all MCP transport types (stdio, SSE, HTTP)
 * 4. Implements comprehensive security policies
 * 5. Handles resource and prompt proxying
 * 6. Provides runtime server management
 * 7. Follows the latest MCP protocol specification
 */

import { ProxyMcpServer } from "../manager/proxy-mcp-server.js";
import { ConfigurationManager } from "../manager/configuration-manager.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { randomUUID } from "crypto";

async function createEnhancedProxyServer() {
  // Create configuration with enhanced example servers
  const configManager = new ConfigurationManager();
  
  // Override with enhanced configuration for demonstration
  const enhancedConfig = {
    servers: [
      {
        id: "filesystem",
        name: "File System MCP Server",
        description: "Provides secure file system access with read/write capabilities",
        transportType: "stdio" as const,
        enabled: true,
        stdio: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp/mcp-demo"],
        },
        security: {
          allowedTools: ["read_file", "list_directory", "write_file"],
          requireAuth: false,
        },
      },
      {
        id: "git",
        name: "Git Operations Server",
        description: "Provides Git repository operations and history access",
        transportType: "stdio" as const,
        enabled: true,
        stdio: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-git", process.cwd()],
        },
        security: {
          allowedTools: ["git_log", "git_diff", "git_status", "git_branch"],
          blockedTools: ["git_reset", "git_push"], // Prevent destructive operations
          requireAuth: false,
        },
      },
      {
        id: "brave-search",
        name: "Brave Search API",
        description: "Web search capabilities via Brave Search API",
        transportType: "stdio" as const,
        enabled: true,
        stdio: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-brave-search"],
          env: {
            BRAVE_API_KEY: process.env.BRAVE_API_KEY || "demo-api-key",
          },
        },
        security: {
          allowedTools: ["brave_web_search"],
          requireAuth: false,
        },
      },
      {
        id: "postgres",
        name: "PostgreSQL Database Server",
        description: "Database query and schema inspection capabilities",
        transportType: "stdio" as const,
        enabled: false, // Disabled by default, can be enabled at runtime
        stdio: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-postgres"],
          env: {
            POSTGRES_CONNECTION_STRING: process.env.POSTGRES_CONNECTION_STRING || "postgresql://localhost:5432/demo",
          },
        },
        security: {
          allowedTools: ["query", "list_tables", "describe_table"],
          blockedTools: ["execute", "drop_table"], // Read-only access
          requireAuth: true,
          allowedScopes: ["database:read"],
        },
      },
      {
        id: "slack",
        name: "Slack Integration Server",
        description: "Slack messaging and channel management",
        transportType: "stdio" as const,
        enabled: false,
        stdio: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-slack"],
          env: {
            SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN || "",
          },
        },
        security: {
          allowedTools: ["list_channels", "send_message", "get_channel_history"],
          requireAuth: true,
          allowedScopes: ["slack:write", "slack:read"],
        },
      },
    ],
    security: {
      globalBlockedTools: ["system_shutdown", "rm_rf", "format_disk"],
      allowServerDiscovery: true,
      defaultRequireAuth: false,
    },
    discovery: {
      enabled: true,
      allowRuntimeServerAddition: true,
      serverMetadataExposure: "full" as const,
    },
  };

  // Update configuration
  configManager.updateConfiguration(enhancedConfig);

  // Create the enhanced proxy server
  const server = new ProxyMcpServer({
    name: "enhanced-mcp-proxy-server",
    version: "1.0.0",
    toolsetConfig: { mode: "readWrite" },
    dynamicToolDiscovery: { enabled: true },
    configurationManager: configManager,
    instructions: `
# Enhanced MCP Proxy Server

This is a comprehensive Model Context Protocol (MCP) proxy server that provides:

## 🚀 Core Capabilities

### Server Discovery & Management
- **Dynamic Server Discovery**: Automatically discover available backend MCP servers
- **Runtime Management**: Add, remove, enable, or disable servers without restart
- **Health Monitoring**: Real-time connection status and health monitoring
- **Security Policies**: Fine-grained access control per server and tool

### Available Backend Servers
${enhancedConfig.servers.map(server => 
  `- **${server.name}** (${server.id}): ${server.description}`
).join('\n')}

### Tool Access Patterns
All tools from backend servers are accessible with the format: \`{serverId}__{toolName}\`

Examples:
- \`filesystem__read_file\` - Read files from the filesystem server
- \`git__git_log\` - Get git commit history
- \`brave-search__brave_web_search\` - Search the web
- \`postgres__query\` - Execute database queries (when enabled)

### Discovery Tools
- \`proxy_server_list\` - List all configured backend servers
- \`proxy_server_tools\` - List tools from a specific server
- \`proxy_server_status\` - Get detailed server status
- \`proxy_server_refresh\` - Refresh server capabilities

### Management Tools
- \`proxy_config_add_server\` - Add new backend servers
- \`proxy_config_remove_server\` - Remove backend servers
- \`proxy_config_enable_server\` - Enable servers
- \`proxy_config_disable_server\` - Disable servers

## 🔒 Security Features

- **Per-server tool filtering**: Control which tools are exposed
- **Authentication support**: OAuth and API key authentication
- **Scope-based access**: Fine-grained permission control
- **Global security policies**: Prevent dangerous operations

## 🔧 Transport Support

- **stdio**: Direct process communication
- **SSE**: Server-Sent Events for web integration
- **HTTP**: RESTful API access (when available)

## 📊 Monitoring & Observability

- Connection health monitoring
- Tool usage tracking
- Error reporting and debugging
- Performance metrics

Use the discovery tools to explore available capabilities and manage the proxy configuration dynamically.
`,
  });

  return server;
}

async function runStdioServer() {
  console.log("Starting Enhanced MCP Proxy Server (stdio)...");
  
  const server = await createEnhancedProxyServer();
  const transport = new StdioServerTransport();
  
  await server.server.connect(transport);
  console.log("Enhanced MCP Proxy Server is running on stdio");
}

async function runHttpServer(port: number = 3000) {
  console.log(`Starting Enhanced MCP Proxy Server (HTTP) on port ${port}...`);
  
  const app = express();
  app.use(express.json());
  
  // Enable CORS for MCP session management
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, mcp-session-id");
    res.header("Access-Control-Expose-Headers", "mcp-session-id");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  const server = await createEnhancedProxyServer();
  const transports: Record<string, StreamableHTTPServerTransport> = {};

  // Streamable HTTP endpoint (recommended)
  app.all('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      transport = transports[sessionId];
    } else {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (newSessionId) => {
          transports[newSessionId] = transport;
          console.log(`New MCP session initialized: ${newSessionId}`);
        },
        enableDnsRebindingProtection: false, // Disable for local development
      });

      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports[transport.sessionId];
          console.log(`MCP session closed: ${transport.sessionId}`);
        }
      };

      await server.server.connect(transport);
    }

    await transport.handleRequest(req, res, req.body);
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    const backendStatuses = server.backend.getServerStatuses();
    const connectedCount = backendStatuses.filter(s => s.connected).length;
    
    res.json({
      status: 'healthy',
      version: '1.0.0',
      backendServers: {
        total: backendStatuses.length,
        connected: connectedCount,
        disconnected: backendStatuses.length - connectedCount,
      },
      activeSessions: Object.keys(transports).length,
    });
  });

  // Server info endpoint
  app.get('/info', (req, res) => {
    res.json({
      name: "Enhanced MCP Proxy Server",
      version: "1.0.0",
      description: "A comprehensive reverse proxy for Model Context Protocol servers",
      endpoints: {
        mcp: "/mcp",
        health: "/health",
        info: "/info",
      },
      features: [
        "Dynamic server discovery",
        "Runtime configuration",
        "Multi-transport support",
        "Security policies",
        "Resource proxying",
        "Prompt management",
      ],
    });
  });

  app.listen(port, () => {
    console.log(`Enhanced MCP Proxy Server is running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`Server info: http://localhost:${port}/info`);
    console.log(`MCP endpoint: http://localhost:${port}/mcp`);
  });
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--http')) {
    const portIndex = args.indexOf('--port');
    const port = portIndex !== -1 ? parseInt(args[portIndex + 1], 10) : 3000;
    await runHttpServer(port);
  } else {
    await runStdioServer();
  }
}

// Check if this file is being run directly
if (process.argv[1] && process.argv[1].endsWith('enhanced-proxy-server.ts') || 
    process.argv[1] && process.argv[1].endsWith('enhanced-proxy-server.js')) {
  main().catch(console.error);
}

export { createEnhancedProxyServer };
