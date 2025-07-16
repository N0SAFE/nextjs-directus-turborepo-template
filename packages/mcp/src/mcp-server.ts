// McpServer main class split from index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListResourceTemplatesRequestSchema,
  SubscribeRequestSchema,
  UnsubscribeRequestSchema,
  CompleteRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import {
  ToolsetConfig,
  DynamicToolDiscoveryOptions,
  ToolCapability,
} from "./types";
import { ToolManager } from "./manager/tool-manager";
import { ResourceManager } from "./manager/resource-manager";
import { PromptManager } from "./manager/prompt-manager";

export class McpServer {
  protected readonly _server: Server;
  protected readonly toolsetConfig: ToolsetConfig;
  private readonly toolManager: ToolManager;
  private readonly resourceManager: ResourceManager;
  private readonly promptManager: PromptManager;

  constructor({
    name,
    version,
    capabilities,
    toolsetConfig,
    dynamicToolDiscovery,
    instructions,
  }: {
    name: string;
    version: string;
    capabilities?: { tools?: ToolCapability[]; resources?: any; prompts?: any };
    toolsetConfig: ToolsetConfig;
    dynamicToolDiscovery?: DynamicToolDiscoveryOptions;
    instructions?: string;
  }) {
    this.toolsetConfig = toolsetConfig;
    this.toolManager = new ToolManager(
      name,
      capabilities?.tools || [],
      toolsetConfig,
      dynamicToolDiscovery
    );
    // Ensure resources and prompts are always valid objects
    const resources = capabilities?.resources ?? {
      definitions: {},
      handlers: {},
    };
    const prompts = capabilities?.prompts ?? { definitions: {}, handlers: {} };
    this.resourceManager = new ResourceManager(resources);
    this.promptManager = new PromptManager(prompts);
    // Determine capabilities for the MCP server
    const hasTools = this.toolManager.hasTools();
    const hasResources = this.resourceManager.hasResources();
    const hasPrompts = this.promptManager.hasPrompts();
    
    // Enhanced MCP capabilities with proper declarations
    const serverCapabilities: any = {
      logging: {},
    };
    
    if (hasTools) {
      serverCapabilities.tools = {
        listChanged: true, // Support for tool list change notifications
      };
    }
    
    if (hasResources) {
      serverCapabilities.resources = {
        subscribe: true,    // Support for resource change subscriptions
        listChanged: true,  // Support for resource list change notifications
      };
    }
    
    if (hasPrompts) {
      serverCapabilities.prompts = {
        listChanged: true,  // Support for prompt list change notifications
      };
    }
    
    // Add completion capability if any resources or prompts support it
    if (hasResources || hasPrompts) {
      serverCapabilities.completion = {
        argument: true,     // Support for argument completion
      };
    }
    // Add dynamicToolDiscovery instructions if enabled
    let dynamicDiscoveryInstructions = '';
    if (dynamicToolDiscovery) {
      dynamicDiscoveryInstructions = `\n\n---\n\n# Dynamic Tool Discovery\n\nThis server supports dynamic tool discovery.\n\n- To check if dynamic tool discovery is enabled, look for the presence of tools named dynamic_tool_list and dynamic_tool_trigger in the tool list.\n- If you need to use a tool that is not currently enabled, you can enable it dynamically using the available tool discovery and enabling mechanisms.\n- Always verify if a tool is available by checking for dynamic_tool_list and dynamic_tool_trigger before attempting to enable or use new tools.\n- Use the dynamic tool discovery process to list, enable, and use tools as needed during your workflow.`;
    }
    this._server = new Server(
      {
        name,
        version,
      },
      {
        capabilities: serverCapabilities,
        instructions: `${instructions}${dynamicDiscoveryInstructions}`,
      }
    );
    // Register handlers
    if (hasTools) {
      this._server.setRequestHandler(
        ListToolsRequestSchema,
        // @ts-ignore
        this.toolManager.listTools.bind(this.toolManager)
      );
      this._server.setRequestHandler(
        CallToolRequestSchema,
        // @ts-ignore
        this.toolManager.callTool.bind(this.toolManager)
      );
      this.toolManager.onEnabledToolsChanged(
        this._server.sendToolListChanged.bind(this._server)
      );
    }

    if (hasResources) {
      this._server.setRequestHandler(
        ListResourcesRequestSchema,
        this.resourceManager.listResources.bind(this.resourceManager)
      );
      this._server.setRequestHandler(
        ReadResourceRequestSchema,
        this.resourceManager.readResource.bind(this.resourceManager)
      );
      this._server.setRequestHandler(
        ListResourceTemplatesRequestSchema,
        this.resourceManager.listResourceTemplates.bind(this.resourceManager)
      );
      this._server.setRequestHandler(
        SubscribeRequestSchema,
        this.resourceManager.subscribeToResource.bind(this.resourceManager)
      );
      this._server.setRequestHandler(
        UnsubscribeRequestSchema,
        this.resourceManager.unsubscribeFromResource.bind(this.resourceManager)
      );
      // Setup resource list change notifications
      this.resourceManager.onResourceListChanged(
        this._server.sendResourceListChanged?.bind(this._server) || (() => {})
      );
    }
    if (hasPrompts) {
      this._server.setRequestHandler(
        ListPromptsRequestSchema,
        this.promptManager.listPrompts.bind(this.promptManager)
      );
      this._server.setRequestHandler(
        GetPromptRequestSchema,
        this.promptManager.getPrompt.bind(this.promptManager)
      );
      // Setup prompt list change notifications
      this.promptManager.onPromptListChanged(
        this._server.sendPromptListChanged?.bind(this._server) || (() => {})
      );
    }
    
    // Handle completion requests
    if (hasResources || hasPrompts) {
      this._server.setRequestHandler(
        CompleteRequestSchema,
        async (request) => {
          const { ref } = request.params;
          
          if (ref.type === "ref/prompt" && "name" in ref) {
            // Type assertion to ensure proper typing
            const promptRequest = {
              params: {
                ref: ref as { type: "ref/prompt"; name: string },
                argument: request.params.argument,
                context: request.params.context,
              },
            };
            return this.promptManager.complete(promptRequest);
          } else if (ref.type === "ref/resource") {
            // Handle resource completion if needed
            return { completion: { values: [] } };
          }
          
          throw new McpError(ErrorCode.InvalidParams, `Unsupported ref type: ${(ref as any).type}`);
        }
      );
    }
    // Error handling
    this._server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.shutdown();
    });
    process.on("SIGTERM", async () => {
      await this.shutdown();
    });
  }

  private async shutdown() {
    try {
      // Clean up notification callbacks
      this.toolManager.offEnabledToolsChanged(
        this._server.sendToolListChanged.bind(this._server)
      );
      
      if (this.resourceManager.hasResources()) {
        this.resourceManager.offResourceListChanged(
          this._server.sendResourceListChanged?.bind(this._server) || (() => {})
        );
      }
      
      if (this.promptManager.hasPrompts()) {
        this.promptManager.offPromptListChanged(
          this._server.sendPromptListChanged?.bind(this._server) || (() => {})
        );
      }
      
      await this._server.close();
      console.log("MCP Server shut down gracefully");
    } catch (error) {
      console.error("Error during shutdown:", error);
    }
    process.exit(0);
  }
  get server() {
    return this._server;
  }
}
