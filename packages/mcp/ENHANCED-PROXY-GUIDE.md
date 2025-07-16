# Enhanced MCP Proxy Server Guide

This guide demonstrates how to create and use a comprehensive Model Context Protocol (MCP) reverse proxy server that provides unified access to multiple backend MCP servers with advanced features like security, discovery, and runtime management.

## Features

### 🚀 Core Capabilities
- **Reverse Proxy Architecture**: Single endpoint for multiple MCP backend servers
- **Dynamic Discovery**: Runtime discovery of available servers and their capabilities
- **Multi-Transport Support**: stdio, SSE, and HTTP transports
- **Security Policies**: Fine-grained access control and authentication
- **Runtime Management**: Add, remove, enable/disable servers without restart
- **Resource & Prompt Proxying**: Full MCP specification compliance

### 🔒 Security Features
- Per-server tool allow/block lists
- OAuth and API key authentication support
- Scope-based access control
- Global security policies
- DNS rebinding protection

### 📊 Monitoring & Observability
- Connection health monitoring
- Real-time status reporting
- Tool usage tracking
- Error reporting and debugging

## Quick Start

### 1. Basic Setup

```bash
# Build the project
npm run build

# Run with default configuration (stdio)
npm run enhanced-proxy

# Run with HTTP server on port 3000
npm run enhanced-proxy -- --http

# Run with HTTP server on custom port
npm run enhanced-proxy -- --http --port 8080
```

### 2. Configuration

Create a `mcp-proxy-config.json` file:

```json
{
  "servers": [
    {
      "id": "filesystem",
      "name": "File System Server",
      "description": "Secure file system access",
      "transportType": "stdio",
      "enabled": true,
      "stdio": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"]
      },
      "security": {
        "allowedTools": ["read_file", "list_directory"],
        "blockedTools": ["delete_file"],
        "requireAuth": false
      }
    },
    {
      "id": "git",
      "name": "Git Operations",
      "description": "Git repository operations",
      "transportType": "stdio",
      "enabled": true,
      "stdio": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-git", "."]
      },
      "security": {
        "allowedTools": ["git_log", "git_diff", "git_status"],
        "blockedTools": ["git_reset", "git_push"],
        "requireAuth": false
      }
    }
  ],
  "security": {
    "globalBlockedTools": ["dangerous_operation"],
    "allowServerDiscovery": true,
    "defaultRequireAuth": false
  },
  "discovery": {
    "enabled": true,
    "allowRuntimeServerAddition": true,
    "serverMetadataExposure": "full"
  }
}
```

## Usage Examples

### Discovery and Management

```typescript
// List all available servers
const servers = await callTool("proxy_server_list", {
  includeDisabled: false,
  includeDetails: true
});

// Get server status
const status = await callTool("proxy_server_status", {});

// List tools from a specific server
const tools = await callTool("proxy_server_tools", {
  serverId: "filesystem"
});

// Refresh server capabilities
await callTool("proxy_server_refresh", {
  serverId: "git"
});
```

### Using Backend Server Tools

All tools from backend servers are accessible with the format `{serverId}__{toolName}`:

```typescript
// File system operations
const fileContent = await callTool("filesystem__read_file", {
  path: "/path/to/file.txt"
});

const directories = await callTool("filesystem__list_directory", {
  path: "/path/to/directory"
});

// Git operations
const gitLog = await callTool("git__git_log", {
  maxCount: 10
});

const gitStatus = await callTool("git__git_status", {});

// Search operations (if search server is configured)
const searchResults = await callTool("brave-search__brave_web_search", {
  query: "Model Context Protocol"
});
```

### Runtime Server Management

```typescript
// Add a new server at runtime
await callTool("proxy_config_add_server", {
  id: "new-server",
  name: "New MCP Server",
  description: "Dynamically added server",
  transportType: "stdio",
  enabled: true,
  stdio: {
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-example"]
  },
  security: {
    allowedTools: ["example_tool"],
    requireAuth: false
  }
});

// Enable/disable servers
await callTool("proxy_config_enable_server", { 
  serverId: "postgres" 
});

await callTool("proxy_config_disable_server", { 
  serverId: "old-server" 
});

// Remove a server
await callTool("proxy_config_remove_server", {
  serverId: "unused-server"
});
```

## Advanced Configuration

### Security Policies

```json
{
  "servers": [
    {
      "id": "secure-server",
      "name": "Secure Operations Server",
      "transportType": "stdio",
      "enabled": true,
      "stdio": {
        "command": "npx",
        "args": ["-y", "@company/secure-mcp-server"]
      },
      "security": {
        "allowedTools": ["read_data", "analyze_data"],
        "blockedTools": ["delete_data", "modify_system"],
        "requireAuth": true,
        "allowedScopes": ["data:read", "data:analyze"]
      }
    }
  ],
  "security": {
    "globalBlockedTools": [
      "system_shutdown",
      "format_disk",
      "delete_all"
    ],
    "allowServerDiscovery": true,
    "defaultRequireAuth": false
  }
}
```

### Environment Variables

You can configure servers using environment variables:

```bash
# Enable environment-based configuration
export MCP_PROXY_USE_ENV=true

# Configure servers
export MCP_SERVER_1_ID=weather
export MCP_SERVER_1_NAME="Weather Server"
export MCP_SERVER_1_TRANSPORT=stdio
export MCP_SERVER_1_COMMAND=npx
export MCP_SERVER_1_ARGS="-y,@modelcontextprotocol/server-weather"

export MCP_SERVER_2_ID=database
export MCP_SERVER_2_NAME="Database Server"
export MCP_SERVER_2_TRANSPORT=stdio
export MCP_SERVER_2_COMMAND=npx
export MCP_SERVER_2_ARGS="-y,@company/database-server"
export MCP_SERVER_2_ENV_1_KEY=DB_CONNECTION
export MCP_SERVER_2_ENV_1_VALUE=postgresql://localhost/mydb
```

### HTTP Server with Authentication

```typescript
import { createEnhancedProxyServer } from './examples/enhanced-proxy-server.js';
import express from 'express';

const app = express();

// Add authentication middleware
app.use('/mcp', (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !isValidToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Create and mount the MCP proxy
const server = await createEnhancedProxyServer();
// ... mount MCP handlers ...

app.listen(3000);
```

## Integration Examples

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "proxy": {
      "command": "node",
      "args": ["dist/examples/enhanced-proxy-server.js"]
    }
  }
}
```

### With Web Applications

```javascript
// Connect via HTTP transport
const mcpClient = new MCPClient('http://localhost:3000/mcp');

// Discover available tools
const tools = await mcpClient.listTools();

// Use proxy tools
const result = await mcpClient.callTool('filesystem__read_file', {
  path: '/config/settings.json'
});
```

### With Python Applications

```python
import asyncio
from mcp import ClientSession, StdioServerParameters

async def main():
    server_params = StdioServerParameters(
        command="node",
        args=["dist/examples/enhanced-proxy-server.js"]
    )
    
    async with ClientSession(server_params) as session:
        # List available tools
        tools = await session.list_tools()
        
        # Call proxy tools
        result = await session.call_tool(
            "git__git_log", 
            {"maxCount": 5}
        )

asyncio.run(main())
```

## Monitoring and Debugging

### Health Checks

```bash
# Check server health (HTTP mode)
curl http://localhost:3000/health

# Response:
{
  "status": "healthy",
  "version": "1.0.0",
  "backendServers": {
    "total": 3,
    "connected": 2,
    "disconnected": 1
  },
  "activeSessions": 1
}
```

### Server Information

```bash
# Get server info
curl http://localhost:3000/info
```

### Debug Mode

```bash
# Run with debug logging
DEBUG=mcp:* npm run enhanced-proxy

# Or with custom log level
LOG_LEVEL=debug npm run enhanced-proxy
```

## Best Practices

### 1. Security
- Always use allow lists rather than block lists for production
- Implement proper authentication for sensitive operations
- Regularly audit tool access permissions
- Use HTTPS in production environments

### 2. Performance
- Monitor backend server health and implement reconnection logic
- Use connection pooling for high-traffic scenarios
- Cache server capabilities to reduce lookup overhead
- Implement rate limiting for external API servers

### 3. Reliability
- Configure appropriate timeouts for backend servers
- Implement graceful degradation when servers are unavailable
- Use circuit breakers for unreliable backend services
- Log all tool calls for debugging and auditing

### 4. Scalability
- Use horizontal scaling with load balancers
- Implement session persistence for stateful operations
- Consider using external configuration stores for large deployments
- Monitor resource usage and scale backend servers independently

## Troubleshooting

### Common Issues

1. **Backend Server Connection Failures**
   ```bash
   # Check server command and arguments
   npx @modelcontextprotocol/server-filesystem /path/to/test
   
   # Verify environment variables
   echo $API_KEY
   ```

2. **Tool Not Found Errors**
   ```typescript
   // Check server status
   const status = await callTool("proxy_server_status", { 
     serverId: "problematic-server" 
   });
   
   // Refresh server capabilities
   await callTool("proxy_server_refresh", { 
     serverId: "problematic-server" 
   });
   ```

3. **Authentication Issues**
   ```typescript
   // Check security configuration
   const servers = await callTool("proxy_server_list", { 
     includeDetails: true 
   });
   ```

### Debug Commands

```bash
# Test individual backend servers
npx @modelcontextprotocol/server-filesystem /tmp
npx @modelcontextprotocol/server-git .

# Validate configuration
node -e "console.log(JSON.parse(require('fs').readFileSync('mcp-proxy-config.json')))"

# Check tool availability
npm run enhanced-proxy -- --list-tools
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

ISC License - see LICENSE file for details.
