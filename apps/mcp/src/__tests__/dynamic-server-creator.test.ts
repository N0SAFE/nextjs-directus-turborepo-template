import { describe, it, expect, beforeEach } from 'vitest';
import { DynamicServerCreator, ServerCreationInstructions } from '../manager/dynamic-server-creator.js';

describe('DynamicServerCreator', () => {
  let creator: DynamicServerCreator;

  beforeEach(() => {
    creator = new DynamicServerCreator();
  });

  describe('createServerFromInstructions', () => {
    it('should create an OpenAPI server', async () => {
      const instructions: ServerCreationInstructions = {
        serverType: 'openapi',
        description: 'Test OpenAPI server',
        capabilities: ['api-calls', 'data-retrieval'],
        configuration: {
          openApiUrl: 'https://api.example.com/swagger.json',
          baseUrl: 'https://api.example.com',
          apiKey: 'test-key'
        }
      };

      const server = await creator.createServerFromInstructions(instructions);
      
      expect(server.id).toMatch(/^generated-\d+-[a-f0-9]{8}$/);
      expect(server.name).toContain('OpenAPI Server');
      expect(server.description).toContain('Generated OpenAPI MCP server: Test OpenAPI server');
      expect(server.transportType).toBe('stdio');
      expect(server.generated).toBe(true);
      expect(server.generatedAt).toBeInstanceOf(Date);
      expect(server.instructions).toEqual(instructions);
      expect(server.stdio).toBeDefined();
      expect(server.stdio?.command).toBe('node');
      expect(server.stdio?.args).toContain('-e');
    });

    it('should create a webhook server', async () => {
      const instructions: ServerCreationInstructions = {
        serverType: 'webhook',
        description: 'Test webhook server',
        capabilities: ['webhook-handling', 'event-processing'],
        configuration: {
          webhookUrl: 'https://example.com/webhook',
          webhookSecret: 'secret123'
        }
      };

      const server = await creator.createServerFromInstructions(instructions);
      
      expect(server.name).toContain('Webhook Server');
      expect(server.description).toContain('Generated webhook MCP server: Test webhook server');
      expect(server.stdio?.env).toHaveProperty('WEBHOOK_URL', 'https://example.com/webhook');
      expect(server.stdio?.env).toHaveProperty('WEBHOOK_SECRET', 'secret123');
    });

    it('should create a database server', async () => {
      const instructions: ServerCreationInstructions = {
        serverType: 'database',
        description: 'Test database server',
        capabilities: ['query-execution', 'schema-inspection'],
        configuration: {
          connectionString: 'postgresql://localhost:5432/testdb',
          databaseType: 'postgresql',
          schema: 'public'
        }
      };

      const server = await creator.createServerFromInstructions(instructions);
      
      expect(server.name).toContain('Database Server');
      expect(server.description).toContain('Generated database MCP server: Test database server');
      expect(server.stdio?.env).toHaveProperty('DATABASE_URL', 'postgresql://localhost:5432/testdb');
      expect(server.stdio?.env).toHaveProperty('DATABASE_TYPE', 'postgresql');
    });

    it('should create a custom server', async () => {
      const instructions: ServerCreationInstructions = {
        serverType: 'custom',
        description: 'Test custom server',
        capabilities: ['custom-operations'],
        configuration: {
          command: 'node',
          args: ['custom-server.js'],
          env: { CUSTOM_VAR: 'value' }
        }
      };

      const server = await creator.createServerFromInstructions(instructions);
      
      expect(server.name).toContain('Custom Server');
      expect(server.description).toContain('Generated custom MCP server: Test custom server');
      expect(server.stdio?.command).toBe('node');
      expect(server.stdio?.args).toEqual(['custom-server.js']);
      expect(server.stdio?.env).toHaveProperty('CUSTOM_VAR', 'value');
    });

    it('should use custom server ID when provided', async () => {
      const instructions: ServerCreationInstructions = {
        serverType: 'custom',
        description: 'Test server with custom ID',
        capabilities: [],
        configuration: {
          command: 'echo',
          args: ['test']
        }
      };

      const customId = 'my-custom-server-id';
      const server = await creator.createServerFromInstructions(instructions, customId);
      
      expect(server.id).toBe(customId);
    });

    it('should throw error for unsupported server type', async () => {
      const instructions = {
        serverType: 'unsupported' as any,
        description: 'Test',
        capabilities: [],
        configuration: {}
      };

      await expect(creator.createServerFromInstructions(instructions))
        .rejects.toThrow('Unsupported server type: unsupported');
    });

    it('should throw error for OpenAPI server without required config', async () => {
      const instructions: ServerCreationInstructions = {
        serverType: 'openapi',
        description: 'Invalid OpenAPI server',
        capabilities: [],
        configuration: {} // Missing openApiUrl or openApiSpec
      };

      await expect(creator.createServerFromInstructions(instructions))
        .rejects.toThrow('OpenAPI server requires either openApiUrl or openApiSpec');
    });

    it('should throw error for webhook server without required config', async () => {
      const instructions: ServerCreationInstructions = {
        serverType: 'webhook',
        description: 'Invalid webhook server',
        capabilities: [],
        configuration: {} // Missing webhookUrl
      };

      await expect(creator.createServerFromInstructions(instructions))
        .rejects.toThrow('Webhook server requires webhookUrl');
    });
  });

  describe('listGeneratedServers', () => {
    it('should return empty list initially', () => {
      const servers = creator.listGeneratedServers();
      expect(servers).toEqual([]);
    });

    it('should list generated servers', async () => {
      const instructions1: ServerCreationInstructions = {
        serverType: 'openapi',
        description: 'Server 1',
        capabilities: [],
        configuration: { openApiUrl: 'https://api1.com/swagger.json' }
      };
      
      const instructions2: ServerCreationInstructions = {
        serverType: 'webhook',
        description: 'Server 2',
        capabilities: [],
        configuration: { webhookUrl: 'https://example.com/webhook' }
      };

      await creator.createServerFromInstructions(instructions1);
      await creator.createServerFromInstructions(instructions2);

      const servers = creator.listGeneratedServers();
      expect(servers).toHaveLength(2);
      expect(servers[0].description).toContain('Server 1');
      expect(servers[1].description).toContain('Server 2');
    });
  });

  describe('removeGeneratedServer', () => {
    it('should remove a generated server', async () => {
      const instructions: ServerCreationInstructions = {
        serverType: 'openapi',
        description: 'Test server',
        capabilities: [],
        configuration: { openApiUrl: 'https://api.com/swagger.json' }
      };

      const server = await creator.createServerFromInstructions(instructions);
      expect(creator.listGeneratedServers()).toHaveLength(1);

      const removed = creator.removeGeneratedServer(server.id);
      expect(removed).toBe(true);
      expect(creator.listGeneratedServers()).toHaveLength(0);
    });

    it('should return false for non-existent server', () => {
      const removed = creator.removeGeneratedServer('non-existent-id');
      expect(removed).toBe(false);
    });
  });

  describe('getGeneratedServer', () => {
    it('should retrieve a generated server by ID', async () => {
      const instructions: ServerCreationInstructions = {
        serverType: 'webhook',
        description: 'Test webhook',
        capabilities: [],
        configuration: { webhookUrl: 'https://example.com/webhook' }
      };

      const server = await creator.createServerFromInstructions(instructions);
      const retrieved = creator.getGeneratedServer(server.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(server.id);
      expect(retrieved?.description).toContain('Test webhook');
    });

    it('should return undefined for non-existent server', () => {
      const retrieved = creator.getGeneratedServer('non-existent-id');
      expect(retrieved).toBeUndefined();
    });
  });
});