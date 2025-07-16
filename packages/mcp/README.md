# MCP Reverse Proxy Server

A comprehensive Model Context Protocol (MCP) reverse proxy server that provides unified access to multiple backend MCP servers with advanced features including security, discovery, resource management, and runtime configuration.

## 🚀 Overview

This MCP proxy server acts as a centralized gateway that allows LLMs and AI applications to:

- **Access Multiple MCP Servers**: Connect to numerous backend MCP servers through a single endpoint
- **Dynamic Discovery**: Discover and manage servers and their capabilities at runtime
- **Enhanced Security**: Apply fine-grained access controls and authentication policies
- **Transport Flexibility**: Support stdio, SSE, and HTTP transport protocols
- **Resource & Prompt Management**: Proxy resources and prompts with full MCP specification compliance
- **Runtime Configuration**: Add, remove, and modify server configurations without restart

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Security](#security)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### Core Capabilities
- **🔄 Reverse Proxy Architecture**: Single MCP endpoint for multiple backend servers
- **🔍 Dynamic Discovery**: Runtime discovery of available servers and tools
- **🔒 Security Policies**: Per-server access control and authentication
- **⚡ Multi-Transport**: Support for stdio, SSE, and HTTP transports
- **📊 Health Monitoring**: Real-time server status and connection monitoring
- **🛠️ Runtime Management**: Dynamic server configuration without restart

### MCP Protocol Compliance
- **✅ Full MCP 2025-03-26 Support**: Latest protocol version compliance
- **🧰 Tools Proxying**: Complete tool discovery and execution
- **📂 Resource Management**: Resource listing, reading, and subscriptions
- **💬 Prompt Support**: Prompt management with completion support
- **🔔 Notifications**: Change notifications for tools, resources, and prompts
- **🔗 Resource Templates**: URI template support for dynamic resources

### Advanced Features
- **🏗️ Session Management**: HTTP session persistence and management
- **🌐 CORS Support**: Cross-origin resource sharing for web integration
- **📈 Monitoring**: Health checks and metrics endpoints
- **🔧 Configuration Hot-Reload**: Dynamic configuration updates
- **🎯 Load Balancing**: Multiple backend server load distribution

## 🚀 Quick Start

### 1. Installation

```bash
git clone <repository>
cd mcp-everything
npm install
npm run build
```

### 2. Basic Usage

```bash
# Run with stdio transport (default)
npm run enhanced-proxy

# Run with HTTP server
npm run enhanced-proxy -- --http

# Run with custom port
npm run enhanced-proxy -- --http --port 8080

# Inspect with MCP Inspector
npm run inspect:enhanced
```

### 3. Test the Proxy

```bash
# Check health (HTTP mode)
curl http://localhost:3000/health

# Get server information
curl http://localhost:3000/info
```

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Backend MCP servers you want to proxy

### Install Dependencies

```bash
npm install
```

### Backend MCP Servers

Install example backend servers:

```bash
# File system server
npm install -g @modelcontextprotocol/server-filesystem

# Git operations server  
npm install -g @modelcontextprotocol/server-git

# Web search server
npm install -g @modelcontextprotocol/server-brave-search

# Database server
npm install -g @modelcontextprotocol/server-postgres
```

## ⚙️ Configuration

### Basic Configuration

Create `mcp-proxy-config.json`:

```json
{
  "servers": [
    {
      "id": "filesystem",
      "name": "File System Server",
      "transportType": "stdio",
      "enabled": true,
      "stdio": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
      }
    }
  ],
  "security": {
    "allowServerDiscovery": true
  },
  "discovery": {
    "enabled": true
  }
}
```

### Environment Variables

```bash
# Use environment-based configuration
export MCP_PROXY_USE_ENV=true
export MCP_PROXY_CONFIG_PATH=./custom-config.json

# Server configuration
export MCP_SERVER_1_ID=filesystem
export MCP_SERVER_1_NAME="File System"
export MCP_SERVER_1_TRANSPORT=stdio
export MCP_SERVER_1_COMMAND=npx
export MCP_SERVER_1_ARGS="-y,@modelcontextprotocol/server-filesystem,/tmp"
```

### Advanced Configuration

See [`mcp-proxy-config.enhanced.json`](./mcp-proxy-config.enhanced.json) for a comprehensive configuration example with:
- Multiple transport types
- Security policies
- Authentication settings
- Monitoring configuration
- Performance tuning

## 🎯 Usage

### Discovery Tools

```typescript
// List all available servers
const servers = await callTool("proxy_server_list", {
  includeDisabled: false,
  includeDetails: true
});

// Get server status
const status = await callTool("proxy_server_status", {});

// List tools from specific server
const tools = await callTool("proxy_server_tools", {
  serverId: "filesystem"
});
```

### Backend Server Tools

Tools are accessed with format `{serverId}__{toolName}`:

```typescript
// File operations
const content = await callTool("filesystem__read_file", {
  path: "/path/to/file.txt"
});

// Git operations  
const log = await callTool("git__git_log", {
  maxCount: 10
});

// Web search
const results = await callTool("brave-search__brave_web_search", {
  query: "Model Context Protocol"
});
```

### Runtime Management

```typescript
// Add new server
await callTool("proxy_config_add_server", {
  id: "new-server",
  name: "New Server", 
  transportType: "stdio",
  enabled: true,
  stdio: {
    command: "npx",
    args: ["-y", "@company/custom-server"]
  }
});

// Enable/disable servers
await callTool("proxy_config_enable_server", { serverId: "postgres" });
await callTool("proxy_config_disable_server", { serverId: "old-server" });
```

## 📚 API Reference

### Discovery Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `proxy_server_list` | List all servers | `includeDisabled?`, `includeDetails?` |
| `proxy_server_tools` | List server tools | `serverId`, `includeDisabled?` |
| `proxy_server_status` | Get server status | `serverId?` |
| `proxy_server_refresh` | Refresh capabilities | `serverId` |

### Management Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `proxy_config_add_server` | Add new server | Server configuration object |
| `proxy_config_remove_server` | Remove server | `serverId` |
| `proxy_config_enable_server` | Enable server | `serverId` |
| `proxy_config_disable_server` | Disable server | `serverId` |

### HTTP Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp` | POST/GET/DELETE | MCP protocol endpoint |
| `/health` | GET | Health check |
| `/info` | GET | Server information |

## 🔒 Security

### Per-Server Security

```json
{
  "security": {
    "allowedTools": ["read_file", "list_directory"],
    "blockedTools": ["delete_file", "write_file"],
    "requireAuth": true,
    "allowedScopes": ["filesystem:read"]
  }
}
```

### Global Security

```json
{
  "security": {
    "globalBlockedTools": ["system_shutdown", "rm_rf"],
    "defaultRequireAuth": false,
    "allowServerDiscovery": true
  }
}
```

### Authentication

```typescript
// OAuth configuration
const server = new ProxyMcpServer({
  // ... config
  authProvider: new OAuthProvider({
    clientId: "your-client-id",
    clientSecret: "your-client-secret",
    authUrl: "https://auth.example.com"
  })
});
```

## 📖 Examples

### Basic Integration

```typescript
import { createEnhancedProxyServer } from './examples/enhanced-proxy-server.js';

const server = await createEnhancedProxyServer();
// Server is ready to use
```

### Web Application Integration

```html
<script type="module">
import { MCPClient } from '@modelcontextprotocol/sdk/client/index.js';

const client = new MCPClient({
  transport: 'http://localhost:3000/mcp'
});

// Discover and use tools
const tools = await client.listTools();
const result = await client.callTool('filesystem__read_file', {
  path: '/config.json'
});
</script>
```

### Python Integration

```python
import asyncio
from mcp import ClientSession, StdioServerParameters

async def main():
    params = StdioServerParameters(
        command="npm",
        args=["run", "enhanced-proxy"]
    )
    
    async with ClientSession(params) as session:
        tools = await session.list_tools()
        result = await session.call_tool("git__git_log", {"maxCount": 5})

asyncio.run(main())
```

## 🔧 Troubleshooting

### Common Issues

1. **Server Connection Failed**
   ```bash
   # Test backend server directly
   npx @modelcontextprotocol/server-filesystem /tmp
   
   # Check proxy status
   npm run enhanced-proxy -- --http &
   curl http://localhost:3000/health
   ```

2. **Tool Not Found**
   ```typescript
   // Refresh server capabilities
   await callTool("proxy_server_refresh", { serverId: "problematic-server" });
   
   // Check server status
   const status = await callTool("proxy_server_status", { serverId: "problematic-server" });
   ```

3. **Permission Denied**
   ```json
   // Check security configuration
   {
     "security": {
       "allowedTools": ["required_tool"],
       "requireAuth": false
     }
   }
   ```

### Debug Mode

```bash
# Enable debug logging
DEBUG=mcp:* npm run enhanced-proxy

# Verbose logging
LOG_LEVEL=debug npm run enhanced-proxy
```

### Health Monitoring

```bash
# Monitor server health
watch -n 5 'curl -s http://localhost:3000/health | jq'

# Check individual server status
curl -s http://localhost:3000/mcp -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"proxy_server_status","arguments":{}}}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests: `npm test`
5. Build: `npm run build`
6. Commit: `git commit -m "Add amazing feature"`
7. Push: `git push origin feature/amazing-feature`
8. Submit a pull request

### Development Setup

```bash
# Clone and setup
git clone <repository>
cd mcp-everything
npm install

# Run tests
npm test

# Development mode
npm run dev

# Build for production
npm run build
```

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) specification
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) TypeScript SDK
- The open source MCP community

---

## 📚 Additional Resources

- **[Enhanced Proxy Guide](./ENHANCED-PROXY-GUIDE.md)**: Comprehensive usage guide
- **[MCP Specification](https://spec.modelcontextprotocol.io/)**: Official protocol specification  
- **[TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)**: Official TypeScript SDK
- **[Example Servers](https://github.com/modelcontextprotocol/servers)**: Official MCP server implementations

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/your-username/mcp-proxy-server).
