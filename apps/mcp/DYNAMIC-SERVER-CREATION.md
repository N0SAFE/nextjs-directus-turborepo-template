# Dynamic MCP Server Creation Guide

The MCP Proxy Server now supports dynamic creation of new MCP servers from natural language instructions. This powerful feature allows you to extend your MCP ecosystem at runtime without manually configuring new servers.

## Available Dynamic Server Creation Tools

### `proxy_create_custom_server`

Create a new MCP server from natural language instructions. Supports multiple server types:

**Parameters:**
- `instructions` (string): Natural language description of what the server should do
- `serverId` (optional string): Custom server ID (auto-generated if not provided)
- `serverType` (optional enum): Specific server type - "openapi", "webhook", "database", "custom"
- `configuration` (optional object): Server-specific configuration options

**Supported Server Types:**

#### 1. OpenAPI/REST API Servers
```javascript
await proxyServer.callTool('proxy_create_custom_server', {
  instructions: 'Create an OpenAPI server for a weather API',
  serverType: 'openapi',
  configuration: {
    openApiUrl: 'https://api.weather.com/swagger.json',
    baseUrl: 'https://api.weather.com',
    apiKey: 'your-api-key'
  }
});
```

#### 2. Webhook Servers
```javascript
await proxyServer.callTool('proxy_create_custom_server', {
  instructions: 'Create a webhook server for GitHub events',
  serverType: 'webhook',
  configuration: {
    webhookUrl: 'https://api.github.com/webhooks',
    webhookSecret: 'your-webhook-secret'
  }
});
```

#### 3. Database Servers
```javascript
await proxyServer.callTool('proxy_create_custom_server', {
  instructions: 'Create a PostgreSQL server for analytics data',
  serverType: 'database',
  configuration: {
    connectionString: 'postgresql://localhost:5432/analytics',
    databaseType: 'postgresql',
    schema: 'public'
  }
});
```

#### 4. Custom Servers
```javascript
await proxyServer.callTool('proxy_create_custom_server', {
  instructions: 'Create a file processing server',
  serverType: 'custom',
  configuration: {
    command: 'node',
    args: ['file-processor.js'],
    env: { PROCESSOR_MODE: 'batch' }
  }
});
```

### `proxy_list_generated_servers`

List all dynamically created MCP servers.

**Parameters:**
- `includeInstructions` (optional boolean): Include the original creation instructions

**Example:**
```javascript
await proxyServer.callTool('proxy_list_generated_servers', {
  includeInstructions: true
});
```

### `proxy_remove_generated_server`

Remove a dynamically created MCP server.

**Parameters:**
- `serverId` (string): ID of the server to remove

**Example:**
```javascript
await proxyServer.callTool('proxy_remove_generated_server', {
  serverId: 'my-dynamic-server'
});
```

## Natural Language Instructions Examples

The system can intelligently parse natural language instructions to create appropriate servers:

### API Integration Examples
- "Create a server for the JSONPlaceholder API to fetch posts and users"
- "Set up a weather API server using OpenWeatherMap with my API key"
- "Create a REST API server for the Slack API with webhook support"

### Database Integration Examples
- "Create a PostgreSQL server for my analytics database"
- "Set up a MySQL server connection to the e-commerce database"
- "Create a SQLite server for local development data"

### Webhook Processing Examples
- "Create a webhook server to receive GitHub push notifications"
- "Set up a webhook processor for Stripe payment events"
- "Create a Discord webhook server for bot notifications"

### Custom Processing Examples
- "Create a file processing server that converts images to different formats"
- "Set up a data transformation server for CSV to JSON conversion"
- "Create a background job processor for email sending"

## Advanced Configuration

### Environment Variables
All dynamic servers can include environment variables:

```javascript
configuration: {
  env: {
    API_KEY: 'your-key',
    DEBUG_MODE: 'true',
    TIMEOUT: '30000'
  }
}
```

### Security Considerations
- Generated servers inherit security settings from the proxy configuration
- API keys and secrets should be provided securely
- Consider using environment variables for sensitive data
- Generated servers can be disabled/enabled like regular servers

### Server Lifecycle
1. **Creation**: Server is generated and added to the proxy configuration
2. **Registration**: Server tools become available through the proxy
3. **Usage**: Tools can be called with the `{serverId}__{toolName}` format
4. **Management**: Server can be listed, monitored, and removed
5. **Cleanup**: Removal automatically cleans up all associated resources

## Integration with Existing Servers

Dynamic servers work seamlessly with pre-configured servers:
- All servers (static and dynamic) appear in the same tool listing
- Security policies apply consistently across all servers
- Dynamic servers can be managed through the same configuration tools
- Backend server management tools work with both types

## Best Practices

1. **Descriptive Instructions**: Provide clear, detailed instructions for better server generation
2. **Meaningful IDs**: Use descriptive server IDs for easier management
3. **Configuration Validation**: Always provide required configuration parameters
4. **Testing**: Test generated servers before relying on them in production
5. **Cleanup**: Remove unused dynamic servers to avoid resource waste
6. **Security**: Never include sensitive data directly in instructions

## Troubleshooting

### Common Issues
- **Missing Configuration**: Ensure required parameters are provided for each server type
- **Invalid URLs**: Verify API endpoints and webhook URLs are accessible
- **Authentication**: Check API keys and authentication credentials
- **Resource Limits**: Monitor system resources when creating multiple servers

### Error Handling
The system provides detailed error messages for:
- Invalid server type specifications
- Missing required configuration
- Network connectivity issues
- Authentication failures
- Resource allocation problems

### Debugging
Use the `proxy_list_generated_servers` tool with `includeInstructions: true` to review server configurations and troubleshoot issues.