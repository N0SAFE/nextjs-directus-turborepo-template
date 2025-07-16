import { describe, it, expect, beforeEach } from 'vitest';
import { McpServer } from '../mcp-server.js';
import { createTool } from '../utils/tools';
import { z } from 'zod';
import { createCallToolOptions, createCallToolRequest, createListToolsOptions, createListToolsRequest } from './utils.js';

const helloWorldTool = {
  name: 'helloWorld',
  description: 'Returns a Hello World greeting.',
  inputSchema: z.object({}),
  annotations: {
    title: 'Hello World Tool',
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
};

describe('McpServer', () => {
  let mcpServer: McpServer;
  beforeEach(() => {
    mcpServer = new McpServer({
      name: 'test_mcp',
      version: '1.0.0',
      toolsetConfig: { mode: 'readOnly' },
      capabilities: {
        tools: [
          createTool(helloWorldTool, async () => ({
            content: [
              { type: 'text', text: 'Hello, World!' },
            ],
          })),
        ],
      },
    });
  });

  it('should list enabled tools', async () => {
    const result = await mcpServer['toolManager'].listTools(createListToolsRequest(), createListToolsOptions());
    expect(result.tools.length).toBe(1);
    expect(result.tools[0].name).toBe('test_mcp__helloWorld');
  });

  it('should call enabled tool', async () => {
    const result = await mcpServer['toolManager'].callTool(createCallToolRequest('test_mcp__helloWorld', {}), createCallToolOptions());
    expect(result.content[0].text).toBe('Hello, World!');
  });

  it('should throw for disabled tool', async () => {
    mcpServer['toolManager']['enabledTools'].delete('helloWorld');
    await expect(mcpServer['toolManager'].callTool(createCallToolRequest('test_mcp__helloWorld', {}), createCallToolOptions())).rejects.toThrow();
  });
});
