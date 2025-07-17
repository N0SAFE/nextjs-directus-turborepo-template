#!/usr/bin/env node

/**
 * HTTP Server for MCP Proxy with Streamable HTTP support
 * Provides REST API and real-time streaming for LLM communication
 */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ProxyMcpServer } from '../manager/proxy-mcp-server.js';
import { ConfigurationManager } from '../manager/configuration-manager.js';
import { getConfigFromCommanderAndEnv } from './config.js';

// Helper function to safely get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

interface McpHttpServer {
  app: express.Application;
  server: any;
  io: SocketIOServer;
  proxyServer: ProxyMcpServer;
}

export class McpHttpServerManager {
  private httpServer: McpHttpServer;
  private port: number;

  constructor(port: number = 3001) {
    this.port = port;
    this.httpServer = this.createHttpServer();
  }

  private createHttpServer(): McpHttpServer {
    const app = express();
    const server = createServer(app);
    const io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // Load configuration
    const toolsetConfig = getConfigFromCommanderAndEnv();
    const configManager = new ConfigurationManager();
    
    // Create proxy server
    const proxyServer = new ProxyMcpServer({
      name: "mcp-proxy-http",
      version: "1.0.0",
      toolsetConfig: toolsetConfig.toolsetConfig || { mode: "readWrite" },
      dynamicToolDiscovery: toolsetConfig.dynamicToolDiscovery || { enabled: true },
      configurationManager: configManager,
    });

    // Middleware
    app.use(cors());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Setup routes
    this.setupRoutes(app, proxyServer, io);
    this.setupSocketHandlers(io, proxyServer);

    return { app, server, io, proxyServer };
  }

  private setupRoutes(app: express.Application, proxyServer: ProxyMcpServer, io: SocketIOServer) {
    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    });

    // MCP Protocol endpoints
    app.get('/mcp/servers', async (req, res) => {
      try {
        const servers = proxyServer.backend.getAllConnections().map(conn => ({
          id: conn.config.id,
          name: conn.config.name,
          description: conn.config.description,
          status: conn.status,
          enabled: conn.config.enabled,
          transportType: conn.config.transportType,
          toolCount: conn.tools.size,
          resourceCount: conn.resources.size,
          promptCount: conn.prompts.size
        }));
        res.json({ servers });
      } catch (error) {
        res.status(500).json({ error: 'Failed to list servers' });
      }
    });

    app.get('/mcp/servers/:serverId/tools', async (req, res) => {
      try {
        const { serverId } = req.params;
        const connection = proxyServer.backend.getServerConnection(serverId);
        
        if (!connection) {
          return res.status(404).json({ error: 'Server not found' });
        }

        const tools = Array.from(connection.tools.values());
        res.json({ tools });
      } catch (error) {
        res.status(500).json({ error: 'Failed to list tools' });
      }
    });

    app.post('/mcp/tools/call', async (req, res) => {
      try {
        const { toolName, arguments: args } = req.body;
        
        // Extract server ID and tool name from the proxy format
        const [serverId, actualToolName] = toolName.split('__');
        
        if (!serverId || !actualToolName) {
          return res.status(400).json({ error: 'Invalid tool name format' });
        }

        const result = await proxyServer.backend.callTool(serverId, actualToolName, args);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to call tool', details: getErrorMessage(error) });
      }
    });

    // Configuration management endpoints
    app.get('/mcp/config', async (req, res) => {
      try {
        const config = proxyServer.config.getConfiguration();
        res.json(config);
      } catch (error) {
        res.status(500).json({ error: 'Failed to get configuration' });
      }
    });

    app.post('/mcp/config/servers', async (req, res) => {
      try {
        const serverConfig = req.body;
        proxyServer.config.addServer(serverConfig);
        
        // Notify clients about server changes
        io.emit('serverAdded', serverConfig);
        
        res.json({ success: true, message: 'Server added successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add server', details: getErrorMessage(error) });
      }
    });

    app.delete('/mcp/config/servers/:serverId', async (req, res) => {
      try {
        const { serverId } = req.params;
        proxyServer.config.removeServer(serverId);
        
        // Notify clients about server changes
        io.emit('serverRemoved', { serverId });
        
        res.json({ success: true, message: 'Server removed successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to remove server' });
      }
    });

    app.put('/mcp/config/servers/:serverId/enable', async (req, res) => {
      try {
        const { serverId } = req.params;
        proxyServer.config.enableServer(serverId);
        
        // Notify clients about server changes
        io.emit('serverEnabled', { serverId });
        
        res.json({ success: true, message: 'Server enabled successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to enable server' });
      }
    });

    app.put('/mcp/config/servers/:serverId/disable', async (req, res) => {
      try {
        const { serverId } = req.params;
        proxyServer.config.disableServer(serverId);
        
        // Notify clients about server changes
        io.emit('serverDisabled', { serverId });
        
        res.json({ success: true, message: 'Server disabled successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to disable server' });
      }
    });

    // Streaming MCP endpoint for real-time communication
    app.post('/mcp/stream', (req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      const clientId = Math.random().toString(36).substr(2, 9);
      
      // Send initial connection message
      res.write(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`);

      // Handle MCP protocol messages
      req.on('data', async (chunk) => {
        try {
          const message = JSON.parse(chunk.toString());
          
          // Process MCP message through proxy server
          const response = await this.processMcpMessage(message, proxyServer);
          
          // Send response back through stream
          res.write(`data: ${JSON.stringify(response)}\n\n`);
        } catch (error) {
          res.write(`data: ${JSON.stringify({ type: 'error', error: getErrorMessage(error) })}\n\n`);
        }
      });

      // Handle client disconnect
      req.on('close', () => {
        console.log(`Client ${clientId} disconnected`);
      });
    });
  }

  private setupSocketHandlers(io: SocketIOServer, proxyServer: ProxyMcpServer) {
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // MCP tool call through WebSocket
      socket.on('mcp:callTool', async (data) => {
        try {
          const { toolName, arguments: args } = data;
          const [serverId, actualToolName] = toolName.split('__');
          
          const result = await proxyServer.backend.callTool(serverId, actualToolName, args);
          socket.emit('mcp:toolResult', { success: true, result });
        } catch (error) {
          socket.emit('mcp:toolResult', { success: false, error: getErrorMessage(error) });
        }
      });

      // Server status updates
      socket.on('mcp:getServerStatus', () => {
        const status = proxyServer.backend.getServerStatuses();
        socket.emit('mcp:serverStatus', status);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private async processMcpMessage(message: any, proxyServer: ProxyMcpServer): Promise<any> {
    switch (message.method) {
      case 'tools/list':
        // Implementation would depend on your specific MCP server structure
        return { id: message.id, result: { tools: [] } };
      
      case 'tools/call':
        const { name, arguments: args } = message.params;
        const [serverId, toolName] = name.split('__');
        const result = await proxyServer.backend.callTool(serverId, toolName, args);
        return { id: message.id, result };
      
      default:
        throw new Error(`Unknown method: ${message.method}`);
    }
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.httpServer.server.listen(this.port, () => {
        console.log(`🚀 MCP HTTP Server running on port ${this.port}`);
        console.log(`📡 Health check: http://localhost:${this.port}/health`);
        console.log(`🔌 WebSocket endpoint: ws://localhost:${this.port}`);
        console.log(`📊 MCP API: http://localhost:${this.port}/mcp/*`);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.httpServer.server.close(() => {
        console.log('MCP HTTP Server stopped');
        resolve();
      });
    });
  }

  getExpressApp(): express.Application {
    return this.httpServer.app;
  }
}

// CLI usage
async function main() {
  const port = parseInt(process.env.MCP_HTTP_PORT || '3001');
  const server = new McpHttpServerManager(port);
  
  await server.start();

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down MCP HTTP Server...');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Shutting down MCP HTTP Server...');
    await server.stop();
    process.exit(0);
  });
}

// Check if this file is being run directly
if (require.main === module) {
  main().catch(console.error);
}

export default McpHttpServerManager;
