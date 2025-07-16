# MCP Proxy Server

An MCP (Model Context Protocol) reverse proxy server that provides unified access to multiple backend MCP servers with security, discovery, and management capabilities.

## Overview

This MCP proxy server acts as a gateway to multiple backend MCP servers, allowing LLMs to:
- **Discover backend servers** and their capabilities dynamically
- **Access tools** from multiple servers through a unified interface
- **Manage server configurations** at runtime
- **Control access** with fine-grained security policies
- **Monitor server health** and connection status

## Key Features

### 🔄 **Reverse Proxy Architecture**
- Acts as a single MCP endpoint for multiple backend servers
- Supports stdio, HTTP, and SSE transports for backend connections
- Automatic reconnection and health monitoring

### 🔍 **Dynamic Discovery**
- Runtime discovery of available MCP servers
- Tool enumeration and capability inspection
- Server status monitoring and management

### 🔒 **Security & Access Control**
- Per-server tool allow/block lists
- Authentication requirements per server
- Global security policies
- Scope-based access control

### ⚡ **Management Tools**
- Add/remove servers at runtime
- Enable/disable servers dynamically
- Refresh server capabilities
- Monitor connection status

## Quick Start

### 1. Installation

```bash
git clone <repository>
cd mcp-everything
npm install
npm run build
```

### 2. Configuration

Create a configuration file `mcp-proxy-config.json`:

```json
{
  "servers": [
    {
      "id": "weather",
      "name": "Weather Server",
      "transportType": "stdio",
      "enabled": true,
      "stdio": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-weather"]
      }
    }
  ],
  "security": {
    "allowServerDiscovery": true,
    "defaultRequireAuth": false
  },
  "discovery": {
    "enabled": true,
    "serverMetadataExposure": "basic"
  }
}
```

### 3. Run the Proxy Server

```bash
# Using config file
npm run proxy

# Using environment variables
MCP_PROXY_USE_ENV=true npm run proxy

# With custom config path
MCP_PROXY_CONFIG_PATH=/path/to/config.json npm run proxy
```

### 4. Connect with MCP Inspector

```bash
npm run inspect:proxy
```

## Configuration

### Server Configuration

Each backend server requires:

- **id**: Unique identifier
- **name**: Human-readable name
- **transportType**: `"stdio"`, `"http"`, or `"sse"`
- **enabled**: Whether the server should be active
- **Transport-specific config** (stdio/http/sse)
- **security**: Optional security policies

#### stdio Transport Example:
```json
{
  "id": "filesystem",
  "name": "File System Server",
  "transportType": "stdio",
  "enabled": true,
  "stdio": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"],
    "env": {
      "SOME_API_KEY": "value"
    }
  }
}
```

#### SSE Transport Example:
```json
{
  "id": "remote",
  "name": "Remote Server",
  "transportType": "sse",
  "enabled": true,
  "sse": {
    "url": "https://api.example.com/mcp",
    "headers": {
      "Authorization": "Bearer token"
    }
  }
}
```

### Security Configuration

```json
{
  "security": {
    "allowedTools": ["tool1", "tool2"],     // Allow only these tools
    "blockedTools": ["dangerous_tool"],     // Block these tools
    "requireAuth": true,                    // Require authentication
    "allowedScopes": ["read", "write"]      // Required auth scopes
  }
}
```

### Environment Variable Configuration

Instead of a config file, you can use environment variables:

```bash
# Enable environment mode
export MCP_PROXY_USE_ENV=true

# Configure servers
export MCP_SERVER_1_ID=weather
export MCP_SERVER_1_NAME="Weather Server"
export MCP_SERVER_1_TRANSPORT=stdio
export MCP_SERVER_1_COMMAND=npx
export MCP_SERVER_1_ARGS="-y,@modelcontextprotocol/server-weather"
export MCP_SERVER_1_ENV_1_KEY=API_KEY
export MCP_SERVER_1_ENV_1_VALUE=your-api-key

export MCP_SERVER_2_ID=files
export MCP_SERVER_2_NAME="File Server"
export MCP_SERVER_2_TRANSPORT=stdio
export MCP_SERVER_2_COMMAND=npx
export MCP_SERVER_2_ARGS="-y,@modelcontextprotocol/server-filesystem,/tmp"

# Global settings
export MCP_PROXY_ALLOW_DISCOVERY=true
export MCP_PROXY_REQUIRE_AUTH=false
```

## Available Tools

### Server Discovery & Management

- **`proxy_server_list`** - List all configured backend servers
- **`proxy_server_tools <serverId>`** - List tools from a specific server  
- **`proxy_server_status [serverId]`** - Get server status information
- **`proxy_server_refresh <serverId>`** - Refresh server capabilities

### Server Configuration

- **`proxy_config_add_server`** - Add a new backend server
- **`proxy_config_remove_server`** - Remove a backend server
- **`proxy_config_enable_server`** - Enable a server
- **`proxy_config_disable_server`** - Disable a server

### Backend Server Tools

All tools from connected backend servers are exposed with the format:
**`{serverId}__{toolName}`**

For example:
- `weather__get_forecast` - Get forecast from weather server
- `files__read_file` - Read file from filesystem server
- `git__log` - Get git log from git server

## Usage Examples

### 1. Discover Available Servers

```typescript
// List all servers
const servers = await callTool("proxy_server_list", {
  includeDisabled: false,
  includeDetails: true
});

// Get server status
const status = await callTool("proxy_server_status", {});
```

### 2. Explore Server Tools

```typescript
// List tools from weather server
const tools = await callTool("proxy_server_tools", {
  serverId: "weather"
});

// Call a tool from the weather server
const forecast = await callTool("weather__get_forecast", {
  location: "San Francisco",
  days: 5
});
```

### 3. Manage Servers at Runtime

```typescript
// Add a new server
await callTool("proxy_config_add_server", {
  id: "new-server",
  name: "New Server",
  transportType: "stdio",
  enabled: true,
  stdio: {
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-example"]
  }
});

// Enable/disable servers
await callTool("proxy_config_enable_server", { serverId: "new-server" });
await callTool("proxy_config_disable_server", { serverId: "old-server" });
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LLM Client    │    │  MCP Proxy      │    │ Backend Server 1│
│                 │◄──►│    Server       │◄──►│   (stdio)       │
│                 │    │                 │    └─────────────────┘
└─────────────────┘    │  ┌─────────────┐│    ┌─────────────────┐
                       │  │Tool Manager ││◄──►│ Backend Server 2│
                       │  │Config Mgr   ││    │    (SSE)        │
                       │  │Security Mgr ││    └─────────────────┘
                       │  │Backend Mgr  ││    ┌─────────────────┐
                       │  └─────────────┘│◄──►│ Backend Server N│
                       └─────────────────┘    │   (HTTP)        │
                                              └─────────────────┘
```

### Components

1. **ProxyMcpServer** - Main server handling LLM connections
2. **BackendServerManager** - Manages connections to backend servers
3. **ProxyToolManager** - Aggregates and proxies tools from backends
4. **ConfigurationManager** - Handles server configuration
5. **Security Layer** - Enforces access control policies

## Security Considerations

- **Tool Filtering**: Control which tools are exposed per server
- **Authentication**: Require auth for sensitive operations
- **Scope Control**: Fine-grained permission management
- **Network Security**: Validate origins and implement proper auth
- **Resource Limits**: Monitor and limit resource usage

## Development

### Build & Test

```bash
npm run build
npm run test
```

### Development Mode

```bash
npm run proxy:dev
```

### Debugging

```bash
npm run inspect:proxy
```

## Configuration Examples

See `mcp-proxy-config.example.json` for a complete configuration example with multiple server types and security policies.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

ISC License - see LICENSE file for details.
