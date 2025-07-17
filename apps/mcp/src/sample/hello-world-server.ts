import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "../mcp-server";
import * as z from "zod";
import { createTool, createToolDefinition } from "../utils/tools";

const helloWorldTool = createToolDefinition({
  name: "hello_world",
  description: "Returns a Hello World greeting.",
  inputSchema: z.object({
    name: z
      .string()
      .optional()
      .describe('provide a optional name to replace "World"'),
  }),
  annotations: {
    title: "Hello World Tool",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
});

const dummyTool = createToolDefinition({
  name: "dummy_tool",
  description: "A dummy tool for testing.",
  inputSchema: z.object({
    input: z.string().describe("Input for the dummy tool"),
  }),
  annotations: {
    title: "Dummy Tool",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
});

class HelloWorldMcpServer extends McpServer {
  constructor() {
    super({
      name: "hello-world-mcp",
      version: "1.0.0",
      toolsetConfig: { mode: "readOnly" },
      dynamicToolDiscovery: {
        enabled: true,
        defaultEnabledToolsets: [dummyTool.name],
      },
      capabilities: {
        tools: [
          createTool(helloWorldTool, async ({ name }) => {
            return {
              content: [
                {
                  type: "text",
                  text: `Hello ${name || "World"}!`,
                },
              ],
            };
          }),
          createTool(dummyTool, async ({ input }) => {
            return {
              content: [
                {
                  type: "text",
                  text: `Dummy tool received: ${input}`,
                },
              ],
            };
          }),
        ],
      },
    });
  }
}

async function main() {
  const server = new HelloWorldMcpServer();
  const transport = new StdioServerTransport();
  await server.server.connect(transport);
  console.error("Hello World MCP server running on stdio");
}

main().catch((error) => console.error(error));
