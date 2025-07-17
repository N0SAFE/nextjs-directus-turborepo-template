import { describe, it, expect, beforeEach } from "vitest";
import { ToolManager } from "../manager/tool-manager";
import { ToolDefinition, DynamicToolDiscoveryOptions } from "../types";
import { z } from "zod";
import { createTool, createToolDefinition } from "../utils/tools";
import { createListToolsRequest, createListToolsOptions, createCallToolOptions, createCallToolRequest } from "./utils";

describe("ToolManager (dynamic tool discovery)", () => {
  let toolManager: ToolManager;
  const toolDef = createToolDefinition({
    name: "testTool",
    description: "A test tool",
    inputSchema: z.object({}),
  });
  const anotherToolDef = createToolDefinition({
    name: "anotherTool",
    description: "Another test tool",
    inputSchema: z.object({}),
  });
  const dynamicOptions = {
    enabled: true,
    defaultEnabledToolsets: [],
  } satisfies DynamicToolDiscoveryOptions;
  beforeEach(() => {
    toolManager = new ToolManager(
      "test_mcp",
      [
        createTool(toolDef, async () => ({
          content: [{ type: "text", text: "ok" }],
        })),
        createTool(anotherToolDef, async () => ({
          content: [{ type: "text", text: "another" }],
        })),
      ],
      { mode: "readOnly" },
      dynamicOptions
    );
  });
  it("should include test_mcp_dynamic_tool_list", async () => {
    const result = await toolManager.listTools(createListToolsRequest(), createListToolsOptions()); // this is needed to initialize the tool manager
    const toolNames = result.tools.map((t) => t.name);
    expect(toolNames).toContain("test_mcp__dynamic_tool_list");
    expect(toolNames).toContain("test_mcp__dynamic_tool_trigger");
  });
  it("should list available and enabled tools via dynamic_tool_list", async () => {
    const result = await toolManager.callTool(createCallToolRequest("test_mcp__dynamic_tool_list", {}), createCallToolOptions());
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.available.map((a) => a.name)).toContain("test_mcp__testTool");
  });
  it("should enable and disable a tool via dynamic_tool_trigger", async () => {
    await toolManager.listTools(createListToolsRequest(), createListToolsOptions()); // this is needed to initialize the tool manager
    // Enable testTool
    await toolManager.callTool(createCallToolRequest("test_mcp__dynamic_tool_trigger", {
      toolsets: [{ name: "test_mcp__testTool", trigger: "enable" }],
    }), createCallToolOptions());
    let result = await toolManager.listTools(createListToolsRequest(), createListToolsOptions());
    let toolNames = result.tools.map((t) => t.name);
    console.log("Tool names after enabling:", toolNames);
    expect(toolNames).toContain("test_mcp__testTool");
    // Disable testTool
    await toolManager.callTool(
      createCallToolRequest("test_mcp__dynamic_tool_trigger", {
        toolsets: [{ name: "test_mcp__testTool", trigger: "disable" }],
      }),
      createCallToolOptions()
    );
    result = await toolManager.listTools(createListToolsRequest(), createListToolsOptions());
    toolNames = result.tools.map((t) => t.name);
    console.log("Tool names after disabling:", toolNames);
    expect(toolNames).not.toContain("test_mcp__testTool");
    
  });
  it("should enable and disable multiple tools in one request via dynamic_tool_trigger", async () => {
    await toolManager.listTools(createListToolsRequest(), createListToolsOptions()); // this is needed to initialize the tool manager
    // Disable both tools in one request
    const disableResult = await toolManager.callTool(createCallToolRequest("test_mcp__dynamic_tool_trigger", {
      toolsets: [
        { name: "test_mcp__testTool", trigger: "disable" },
        { name: "test_mcp__anotherTool", trigger: "disable" },
      ],
    }), createCallToolOptions());
    let result = await toolManager.listTools(createListToolsRequest(), createListToolsOptions());
    let toolNames = result.tools.map((t) => t.name);
    expect(toolNames).not.toContain("test_mcp__testTool");
    expect(toolNames).not.toContain("test_mcp__anotherTool");
    // Check return value after disabling
    const disabledParsed = JSON.parse(disableResult.content[0].text);
    expect(disabledParsed.enabled.map((a) => a.name)).not.toContain("test_mcp__testTool");
    expect(disabledParsed.enabled.map((a) => a.name)).not.toContain("test_mcp__anotherTool");
    // Enable both tools in one request
    const enableResult = await toolManager.callTool(createCallToolRequest("test_mcp__dynamic_tool_trigger", {
      toolsets: [
        { name: "test_mcp__testTool", trigger: "enable" },
        { name: "test_mcp__anotherTool", trigger: "enable" },
      ],
    }), createCallToolOptions());
    result = await toolManager.listTools(createListToolsRequest(), createListToolsOptions());
    toolNames = result.tools.map((t) => t.name);
    expect(toolNames).toContain("test_mcp__testTool");
    expect(toolNames).toContain("test_mcp__anotherTool");
    // Check return value after enabling
    const enabledParsed = JSON.parse(enableResult.content[0].text);
    expect(enabledParsed.enabled.map((a) => a.name)).toContain("test_mcp__testTool");
    expect(enabledParsed.enabled.map((a) => a.name)).toContain("test_mcp__anotherTool");
  });

  it("should call notifyEnabledToolsChanged and trigger subscriptions", async () => {
    await toolManager.listTools(createListToolsRequest(), createListToolsOptions()); // this is needed to initialize the tool manager
    let called = false;
    const callback = (tools) => {
      called = true;
      expect(Array.isArray(tools.tools)).toBe(true);
    };
    toolManager.onEnabledToolsChanged(callback);
    // Trigger a change
    await toolManager.callTool(createCallToolRequest("test_mcp__dynamic_tool_trigger", {
      toolsets: [{ name: "test_mcp__testTool", trigger: "disable" }],
    }), createCallToolOptions());
    expect(called).toBe(true);
    toolManager.offEnabledToolsChanged(callback);
    called = false;
    // Should not call after off
    await toolManager.callTool(createCallToolRequest("test_mcp__dynamic_tool_trigger", {
      toolsets: [{ name: "test_mcp__testTool", trigger: "enable" }],
    }), createCallToolOptions());
    expect(called).toBe(false);
  });
});
