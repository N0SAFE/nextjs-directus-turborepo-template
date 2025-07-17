import { describe, it, expect, beforeEach } from "vitest";
import { ToolManager } from "../manager/tool-manager.js";
import { createTool } from "../utils/tools";
import { z } from "zod";
import {
  createCallToolOptions,
  createCallToolRequest,
  createListToolsOptions,
  createListToolsRequest,
} from "./utils.js";
import { ToolDefinition } from "../types.js";
import { read } from "fs";

describe("ToolManager", () => {
  let toolManager: ToolManager;
  const toolDefReadOnly: ToolDefinition = {
    name: "testToolReadOnly",
    description: "A test tool",
    inputSchema: z.object({}),
    annotations: {
      readOnlyHint: true,
    },
  };
  const toolDefNotReadOnly: ToolDefinition = {
    name: "testToolNotReadOnly",
    description: "A test tool",
    inputSchema: z.object({}),
    annotations: {
      readOnlyHint: false,
    },
  };
  beforeEach(() => {
    toolManager = new ToolManager(
      "test_mcp",
      [
        createTool(toolDefReadOnly, async () => ({
          content: [{ type: "text", text: "ok" }],
        })),
        createTool(toolDefNotReadOnly, async () => ({
          content: [{ type: "text", text: "ok" }],
        })),
      ],
      { mode: "readOnly" }
    );
  });
  it("lists enabled tools in read only mode (1/2)", async () => {
    const result = await toolManager.listTools(
      createListToolsRequest(),
      createListToolsOptions()
    );
    expect(result.tools.length).toBe(1);
    expect(result.tools[0].name).toBe("test_mcp__testToolReadOnly");
  });
  it("calls enabled tool in read only mode", async () => {
    const result = await toolManager.callTool(
      createCallToolRequest("test_mcp__testToolReadOnly", {}),
      createCallToolOptions()
    );
    expect(result.content[0].text).toBe("ok");
  });
  it("throws for disabled tool", async () => {
    toolManager["enabledTools"].delete("testToolReadOnly");
    await expect(
      toolManager.callTool(
        createCallToolRequest("test_mcp__testToolReadOnly", {}),
        createCallToolOptions()
      )
    ).rejects.toThrow();
  });
  it("throws for not read only tool in read only mode", async () => {
    await expect(
      toolManager.callTool(
        createCallToolRequest("test_mcp__testToolNotReadOnly", {}),
        createCallToolOptions()
      )
    ).rejects.toThrow();
  });
});
