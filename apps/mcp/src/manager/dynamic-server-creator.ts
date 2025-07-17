// DynamicServerCreator handles creation of new MCP servers from LLM instructions
import { BackendServerConfig, BackendServerTransportType } from "../types.js";
import { randomUUID } from "crypto";
import { z } from "zod";

export interface ServerCreationInstructions {
  serverType: "openapi" | "custom" | "webhook" | "database";
  description: string;
  capabilities: string[];
  configuration: Record<string, any>;
}

export interface GeneratedServerConfig extends BackendServerConfig {
  generated: boolean;
  generatedAt: Date;
  instructions: ServerCreationInstructions;
}

export class DynamicServerCreator {
  private generatedServers: Map<string, GeneratedServerConfig> = new Map();

  /**
   * Create a new MCP server from LLM instructions
   */
  async createServerFromInstructions(
    instructions: ServerCreationInstructions,
    customId?: string
  ): Promise<GeneratedServerConfig> {
    const serverId = customId || `generated-${Date.now()}-${randomUUID().slice(0, 8)}`;
    
    let serverConfig: GeneratedServerConfig;

    switch (instructions.serverType) {
      case "openapi":
        serverConfig = await this.createOpenApiServer(serverId, instructions);
        break;
      case "webhook":
        serverConfig = await this.createWebhookServer(serverId, instructions);
        break;
      case "database":
        serverConfig = await this.createDatabaseServer(serverId, instructions);
        break;
      case "custom":
        serverConfig = await this.createCustomServer(serverId, instructions);
        break;
      default:
        throw new Error(`Unsupported server type: ${instructions.serverType}`);
    }

    this.generatedServers.set(serverId, serverConfig);
    return serverConfig;
  }

  /**
   * Create an OpenAPI-based MCP server
   */
  private async createOpenApiServer(
    serverId: string,
    instructions: ServerCreationInstructions
  ): Promise<GeneratedServerConfig> {
    const config = instructions.configuration;
    
    if (!config.openApiUrl && !config.openApiSpec) {
      throw new Error("OpenAPI server requires either openApiUrl or openApiSpec");
    }

    // Generate a custom MCP server that wraps the OpenAPI
    const serverCode = this.generateOpenApiServerCode(config);
    
    return {
      id: serverId,
      name: `OpenAPI Server: ${instructions.description}`,
      description: `Generated OpenAPI MCP server: ${instructions.description}`,
      transportType: "stdio" as BackendServerTransportType,
      enabled: true,
      stdio: {
        command: "node",
        args: ["-e", serverCode],
        env: {
          ...config.env,
          OPENAPI_URL: config.openApiUrl,
          OPENAPI_SPEC: config.openApiSpec ? JSON.stringify(config.openApiSpec) : undefined,
          BASE_URL: config.baseUrl,
          API_KEY: config.apiKey,
        }
      },
      security: {
        allowedTools: instructions.capabilities,
        requireAuth: !!config.apiKey,
      },
      generated: true,
      generatedAt: new Date(),
      instructions,
    };
  }

  /**
   * Create a webhook-based MCP server
   */
  private async createWebhookServer(
    serverId: string,
    instructions: ServerCreationInstructions
  ): Promise<GeneratedServerConfig> {
    const config = instructions.configuration;

    if (!config.webhookUrl) {
      throw new Error("Webhook server requires webhookUrl");
    }

    const serverCode = this.generateWebhookServerCode(config);

    return {
      id: serverId,
      name: `Webhook Server: ${instructions.description}`,
      description: `Generated webhook MCP server: ${instructions.description}`,
      transportType: "stdio" as BackendServerTransportType,
      enabled: true,
      stdio: {
        command: "node",
        args: ["-e", serverCode],
        env: {
          ...config.env,
          WEBHOOK_URL: config.webhookUrl,
          WEBHOOK_SECRET: config.webhookSecret,
        }
      },
      security: {
        allowedTools: instructions.capabilities,
        requireAuth: !!config.webhookSecret,
      },
      generated: true,
      generatedAt: new Date(),
      instructions,
    };
  }

  /**
   * Create a database MCP server
   */
  private async createDatabaseServer(
    serverId: string,
    instructions: ServerCreationInstructions
  ): Promise<GeneratedServerConfig> {
    const config = instructions.configuration;

    if (!config.connectionString && !config.database) {
      throw new Error("Database server requires connectionString or database configuration");
    }

    const serverCode = this.generateDatabaseServerCode(config);

    return {
      id: serverId,
      name: `Database Server: ${instructions.description}`,
      description: `Generated database MCP server: ${instructions.description}`,
      transportType: "stdio" as BackendServerTransportType,
      enabled: true,
      stdio: {
        command: "node",
        args: ["-e", serverCode],
        env: {
          ...config.env,
          DATABASE_URL: config.connectionString,
          DATABASE_TYPE: config.databaseType || "postgresql",
          DATABASE_SCHEMA: config.schema,
        }
      },
      security: {
        allowedTools: instructions.capabilities,
        requireAuth: true,
        allowedScopes: ["database:read", "database:write"],
      },
      generated: true,
      generatedAt: new Date(),
      instructions,
    };
  }

  /**
   * Create a custom MCP server from code or instructions
   */
  private async createCustomServer(
    serverId: string,
    instructions: ServerCreationInstructions
  ): Promise<GeneratedServerConfig> {
    const config = instructions.configuration;

    if (!config.serverCode && !config.command) {
      throw new Error("Custom server requires either serverCode or command");
    }

    let stdio: any;
    
    if (config.serverCode) {
      stdio = {
        command: "node",
        args: ["-e", config.serverCode],
        env: config.env || {},
      };
    } else {
      stdio = {
        command: config.command,
        args: config.args || [],
        env: config.env || {},
      };
    }

    return {
      id: serverId,
      name: `Custom Server: ${instructions.description}`,
      description: `Generated custom MCP server: ${instructions.description}`,
      transportType: "stdio" as BackendServerTransportType,
      enabled: true,
      stdio,
      security: {
        allowedTools: instructions.capabilities,
        requireAuth: config.requireAuth || false,
      },
      generated: true,
      generatedAt: new Date(),
      instructions,
    };
  }

  /**
   * Generate OpenAPI MCP server code
   */
  private generateOpenApiServerCode(config: any): string {
    return `
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

const server = new Server(
  {
    name: 'generated-openapi-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// OpenAPI integration logic
async function setupOpenApiTools() {
  const openApiSpec = process.env.OPENAPI_SPEC ? JSON.parse(process.env.OPENAPI_SPEC) : null;
  const openApiUrl = process.env.OPENAPI_URL;
  const baseUrl = process.env.BASE_URL;
  const apiKey = process.env.API_KEY;

  let spec = openApiSpec;
  if (!spec && openApiUrl) {
    const response = await fetch(openApiUrl);
    spec = await response.json();
  }

  if (!spec) {
    throw new Error('No OpenAPI specification provided');
  }

  // Generate tools from OpenAPI spec
  const paths = spec.paths || {};
  for (const [path, pathItem] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (typeof operation !== 'object' || !operation.operationId) continue;
      
      const toolName = operation.operationId.replace(/[^a-zA-Z0-9_]/g, '_');
      const description = operation.summary || operation.description || \`\${method.toUpperCase()} \${path}\`;
      
      // Build input schema from parameters
      const parameters = operation.parameters || [];
      const properties = {};
      const required = [];
      
      parameters.forEach(param => {
        if (param.required) required.push(param.name);
        properties[param.name] = {
          type: param.schema?.type || 'string',
          description: param.description || ''
        };
      });

      server.setRequestHandler('tools/call', async (request) => {
        if (request.params.name !== toolName) return;
        
        try {
          const url = new URL(path, baseUrl);
          const options = {
            method: method.toUpperCase(),
            headers: {
              'Content-Type': 'application/json',
              ...(apiKey && { 'Authorization': \`Bearer \${apiKey}\` })
            }
          };

          if (method.toLowerCase() !== 'get' && request.params.arguments) {
            options.body = JSON.stringify(request.params.arguments);
          }

          const response = await fetch(url.toString(), options);
          const data = await response.json();

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(data, null, 2)
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: \`Error: \${error.message}\`
              }
            ]
          };
        }
      });

      // Register the tool
      server.setRequestHandler('tools/list', async () => {
        return {
          tools: [{
            name: toolName,
            description,
            inputSchema: {
              type: 'object',
              properties,
              required
            }
          }]
        };
      });
    }
  }
}

async function main() {
  await setupOpenApiTools();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
    `;
  }

  /**
   * Generate webhook MCP server code
   */
  private generateWebhookServerCode(config: any): string {
    return `
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

const server = new Server(
  {
    name: 'generated-webhook-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const webhookUrl = process.env.WEBHOOK_URL;
const webhookSecret = process.env.WEBHOOK_SECRET;

server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'send_webhook',
        description: 'Send a webhook request',
        inputSchema: {
          type: 'object',
          properties: {
            payload: {
              type: 'object',
              description: 'Payload to send to webhook'
            },
            headers: {
              type: 'object',
              description: 'Additional headers'
            }
          },
          required: ['payload']
        }
      }
    ]
  };
});

server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'send_webhook') {
    try {
      const { payload, headers = {} } = request.params.arguments;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(webhookSecret && { 'X-Webhook-Secret': webhookSecret }),
          ...headers
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.text();

      return {
        content: [
          {
            type: 'text',
            text: \`Webhook sent successfully. Status: \${response.status}, Response: \${responseData}\`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: \`Error sending webhook: \${error.message}\`
          }
        ]
      };
    }
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
    `;
  }

  /**
   * Generate database MCP server code
   */
  private generateDatabaseServerCode(config: any): string {
    return `
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

const server = new Server(
  {
    name: 'generated-database-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const databaseUrl = process.env.DATABASE_URL;
const databaseType = process.env.DATABASE_TYPE || 'postgresql';

server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'execute_query',
        description: 'Execute a database query',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'SQL query to execute'
            },
            parameters: {
              type: 'array',
              description: 'Query parameters'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'list_tables',
        description: 'List all tables in the database',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  };
});

server.setRequestHandler('tools/call', async (request) => {
  const toolName = request.params.name;
  
  try {
    if (toolName === 'execute_query') {
      const { query, parameters = [] } = request.params.arguments;
      
      // Note: This is a simplified example. In production, you'd want proper
      // database connection handling and SQL injection protection
      return {
        content: [
          {
            type: 'text',
            text: \`Query execution simulated: \${query} with parameters: \${JSON.stringify(parameters)}\`
          }
        ]
      };
    }
    
    if (toolName === 'list_tables') {
      return {
        content: [
          {
            type: 'text',
            text: 'Tables listing simulated for database type: ' + databaseType
          }
        ]
      };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: \`Database error: \${error.message}\`
        }
      ]
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
    `;
  }

  /**
   * Parse instructions from natural language
   */
  parseInstructions(naturalLanguageInstructions: string): ServerCreationInstructions {
    const instructions = naturalLanguageInstructions.toLowerCase();
    
    // Determine server type
    let serverType: ServerCreationInstructions["serverType"] = "custom";
    if (instructions.includes("openapi") || instructions.includes("rest api") || instructions.includes("swagger")) {
      serverType = "openapi";
    } else if (instructions.includes("webhook") || instructions.includes("http post")) {
      serverType = "webhook";
    } else if (instructions.includes("database") || instructions.includes("sql") || instructions.includes("postgres")) {
      serverType = "database";
    }

    // Extract capabilities
    const capabilities: string[] = [];
    if (instructions.includes("read") || instructions.includes("get") || instructions.includes("list")) {
      capabilities.push("read");
    }
    if (instructions.includes("write") || instructions.includes("post") || instructions.includes("create")) {
      capabilities.push("write");
    }
    if (instructions.includes("update") || instructions.includes("put") || instructions.includes("patch")) {
      capabilities.push("update");
    }
    if (instructions.includes("delete") || instructions.includes("remove")) {
      capabilities.push("delete");
    }

    // Basic configuration based on type
    const configuration: Record<string, any> = {};
    
    // Extract URLs or endpoints mentioned
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urls = naturalLanguageInstructions.match(urlRegex);
    if (urls && urls.length > 0) {
      if (serverType === "openapi") {
        configuration.openApiUrl = urls[0];
        configuration.baseUrl = urls[1] || urls[0].replace(/\/[^\/]*$/, '');
      } else if (serverType === "webhook") {
        configuration.webhookUrl = urls[0];
      }
    }

    return {
      serverType,
      description: naturalLanguageInstructions,
      capabilities,
      configuration,
    };
  }

  /**
   * Get a generated server by ID
   */
  getGeneratedServer(serverId: string): GeneratedServerConfig | undefined {
    return this.generatedServers.get(serverId);
  }

  /**
   * List all generated servers
   */
  listGeneratedServers(): GeneratedServerConfig[] {
    return Array.from(this.generatedServers.values());
  }

  /**
   * Remove a generated server
   */
  removeGeneratedServer(serverId: string): boolean {
    return this.generatedServers.delete(serverId);
  }
}