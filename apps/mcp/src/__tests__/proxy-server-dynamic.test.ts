import { describe, it, expect, beforeEach } from 'vitest';
import { ProxyMcpServer } from '../manager/proxy-mcp-server.js';
import { ConfigurationManager } from '../manager/configuration-manager.js';
import { BackendServerConfig } from '../types.js';

describe('ProxyMcpServer - Dynamic Server Creation', () => {
  let proxyServer: ProxyMcpServer;
  let configManager: ConfigurationManager;

  beforeEach(() => {
    // Create a minimal configuration for testing
    const testConfig = {
      servers: [] as BackendServerConfig[],
      security: {
        globalBlockedTools: [],
        allowServerDiscovery: true,
        defaultRequireAuth: false,
      },
      discovery: {
        enabled: true,
        allowRuntimeServerAddition: true,
        serverMetadataExposure: "full" as const,
      },
    };

    configManager = new ConfigurationManager();
    configManager.updateConfiguration(testConfig);

    proxyServer = new ProxyMcpServer({
      name: "test-proxy-server",
      version: "1.0.0",
      toolsetConfig: { mode: "readWrite" },
      dynamicToolDiscovery: { enabled: true },
      configurationManager: configManager,
    });
  });

  describe('proxy_create_custom_server tool', () => {
    it('should create an OpenAPI server from instructions', async () => {
      const tools = proxyServer.listTools();
      const createServerTool = tools.find(t => t.name === 'proxy_create_custom_server');
      expect(createServerTool).toBeDefined();

      // Mock the tool call
      const result = await proxyServer.callTool('proxy_create_custom_server', {
        instructions: 'Create an OpenAPI server for a weather API',
        serverType: 'openapi',
        configuration: {
          openApiUrl: 'https://api.weather.com/swagger.json',
          baseUrl: 'https://api.weather.com',
          apiKey: 'test-weather-key'
        }
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('successfully created');
      expect(result.content[0].text).toContain('OpenAPI server');
    });

    it('should create a webhook server from instructions', async () => {
      const result = await proxyServer.callTool('proxy_create_custom_server', {
        instructions: 'Create a webhook server for receiving GitHub events',
        serverType: 'webhook',
        configuration: {
          webhookUrl: 'https://api.github.com/webhooks',
          webhookSecret: 'github-secret-123'
        }
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('successfully created');
      expect(result.content[0].text).toContain('webhook server');
    });

    it('should create a database server from instructions', async () => {
      const result = await proxyServer.callTool('proxy_create_custom_server', {
        instructions: 'Create a PostgreSQL database server for analytics data',
        serverType: 'database',
        configuration: {
          connectionString: 'postgresql://localhost:5432/analytics',
          databaseType: 'postgresql',
          schema: 'public'
        }
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('successfully created');
      expect(result.content[0].text).toContain('database server');
    });

    it('should create a custom server from instructions', async () => {
      const result = await proxyServer.callTool('proxy_create_custom_server', {
        instructions: 'Create a custom Node.js server for file processing',
        serverType: 'custom',
        configuration: {
          command: 'node',
          args: ['file-processor.js'],
          env: { PROCESSOR_MODE: 'batch' }
        }
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('successfully created');
      expect(result.content[0].text).toContain('custom server');
    });

    it('should use custom server ID when provided', async () => {
      const customId = 'my-special-server';
      const result = await proxyServer.callTool('proxy_create_custom_server', {
        instructions: 'Create a test server',
        serverId: customId,
        serverType: 'custom',
        configuration: {
          command: 'echo',
          args: ['test']
        }
      });

      expect(result.content[0].text).toContain(customId);
    });

    it('should handle errors gracefully', async () => {
      const result = await proxyServer.callTool('proxy_create_custom_server', {
        instructions: 'Create an invalid server',
        serverType: 'openapi',
        configuration: {} // Missing required configuration
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      // Should contain error information but not throw
      expect(result.content[0].text).toBeTruthy();
    });
  });

  describe('proxy_list_generated_servers tool', () => {
    it('should list empty servers initially', async () => {
      const result = await proxyServer.callTool('proxy_list_generated_servers', {});

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('No generated servers found');
    });

    it('should list generated servers after creation', async () => {
      // First create a server
      await proxyServer.callTool('proxy_create_custom_server', {
        instructions: 'Create a test server',
        serverType: 'custom',
        configuration: {
          command: 'echo',
          args: ['test']
        }
      });

      // Then list servers
      const result = await proxyServer.callTool('proxy_list_generated_servers', {});

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Generated servers:');
      expect(result.content[0].text).toContain('test server');
    });

    it('should include instructions when requested', async () => {
      // Create a server
      const instructions = 'Create a complex webhook server with authentication';
      await proxyServer.callTool('proxy_create_custom_server', {
        instructions,
        serverType: 'webhook',
        configuration: {
          webhookUrl: 'https://example.com/webhook',
          webhookSecret: 'secret'
        }
      });

      // List with instructions
      const result = await proxyServer.callTool('proxy_list_generated_servers', {
        includeInstructions: true
      });

      expect(result.content[0].text).toContain(instructions);
    });

    it('should not include instructions when not requested', async () => {
      // Create a server
      const instructions = 'Create a server with private instructions';
      await proxyServer.callTool('proxy_create_custom_server', {
        instructions,
        serverType: 'custom',
        configuration: { command: 'echo' }
      });

      // List without instructions
      const result = await proxyServer.callTool('proxy_list_generated_servers', {
        includeInstructions: false
      });

      expect(result.content[0].text).not.toContain(instructions);
    });
  });

  describe('proxy_remove_generated_server tool', () => {
    it('should remove a generated server', async () => {
      // Create a server first
      const createResult = await proxyServer.callTool('proxy_create_custom_server', {
        instructions: 'Create a server to be removed',
        serverId: 'server-to-remove',
        serverType: 'custom',
        configuration: { command: 'echo' }
      });

      expect(createResult.content[0].text).toContain('successfully created');

      // Verify it exists
      const listResult1 = await proxyServer.callTool('proxy_list_generated_servers', {});
      expect(listResult1.content[0].text).toContain('server-to-remove');

      // Remove the server
      const removeResult = await proxyServer.callTool('proxy_remove_generated_server', {
        serverId: 'server-to-remove'
      });

      expect(removeResult.content[0].text).toContain('successfully removed');

      // Verify it's gone
      const listResult2 = await proxyServer.callTool('proxy_list_generated_servers', {});
      expect(listResult2.content[0].text).toContain('No generated servers found');
    });

    it('should handle removal of non-existent server', async () => {
      const result = await proxyServer.callTool('proxy_remove_generated_server', {
        serverId: 'non-existent-server'
      });

      expect(result.content[0].text).toContain('not found');
    });
  });

  describe('integration tests', () => {
    it('should handle complete workflow: create, list, remove', async () => {
      // 1. Create multiple servers
      await proxyServer.callTool('proxy_create_custom_server', {
        instructions: 'Create server 1',
        serverId: 'server-1',
        serverType: 'custom',
        configuration: { command: 'echo', args: ['1'] }
      });

      await proxyServer.callTool('proxy_create_custom_server', {
        instructions: 'Create server 2',
        serverId: 'server-2',
        serverType: 'webhook',
        configuration: { webhookUrl: 'https://example.com/2' }
      });

      // 2. List and verify both exist
      const listResult = await proxyServer.callTool('proxy_list_generated_servers', {});
      expect(listResult.content[0].text).toContain('server-1');
      expect(listResult.content[0].text).toContain('server-2');

      // 3. Remove one server
      await proxyServer.callTool('proxy_remove_generated_server', {
        serverId: 'server-1'
      });

      // 4. Verify only one remains
      const listResult2 = await proxyServer.callTool('proxy_list_generated_servers', {});
      expect(listResult2.content[0].text).not.toContain('server-1');
      expect(listResult2.content[0].text).toContain('server-2');

      // 5. Remove the last server
      await proxyServer.callTool('proxy_remove_generated_server', {
        serverId: 'server-2'
      });

      // 6. Verify none remain
      const listResult3 = await proxyServer.callTool('proxy_list_generated_servers', {});
      expect(listResult3.content[0].text).toContain('No generated servers found');
    });
  });
});